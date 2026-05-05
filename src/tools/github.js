import { execa } from 'execa';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { pool } from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const BASE_DIR = path.join(process.cwd(), "projects");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

/**
 * Pushes the project code to GitHub.
 * Creates a new repository if it doesn't exist, otherwise updates the existing one.
 */
export async function pushToGitHub(projectId, commitMessage = "Update from Akili") {
    try {
        console.log(`🚀 Starting GitHub push for project ${projectId}...`);
        const projectRoot = path.join(BASE_DIR, projectId.toString());
        
        if (!fs.existsSync(projectRoot)) {
            return { success: false, error: "Project directory not found" };
        }

        // Get project title for repo name
        const chatRes = await pool.query("SELECT title FROM chats WHERE id = $1", [projectId]);
        if (chatRes.rows.length === 0) {
            return { success: false, error: "Chat context not found in database" };
        }
        
        const rawTitle = chatRes.rows[0].title || `project-${projectId}`;
        // Sanitize title for GitHub repo name
        const repoName = rawTitle.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const isNewLocalRepo = !fs.existsSync(path.join(projectRoot, ".git"));

        if (isNewLocalRepo) {
            console.log(`📦 Initializing new git repo: ${repoName}`);
            await execa('git', ['init'], { cwd: projectRoot });
            
            // Try to create repo on GitHub
            try {
                await axios.post('https://api.github.com/user/repos', {
                    name: repoName,
                    description: `Built with Akili: ${rawTitle}`,
                    private: false,
                    auto_init: false
                }, {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                console.log(`✅ Created GitHub repo: ${repoName}`);
            } catch (err) {
                if (err.response && err.response.status === 422) {
                    console.log(`ℹ️ Repo ${repoName} already exists on GitHub.`);
                } else {
                    throw err;
                }
            }

            const remoteUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${repoName}.git`;
            
            // Check if origin already exists (just in case)
            try {
                await execa('git', ['remote', 'add', 'origin', remoteUrl], { cwd: projectRoot });
            } catch (e) {
                await execa('git', ['remote', 'set-url', 'origin', remoteUrl], { cwd: projectRoot });
            }
        }

        // Add and Commit
        await execa('git', ['add', '.'], { cwd: projectRoot });
        
        try {
            await execa('git', ['commit', '-m', commitMessage], { cwd: projectRoot });
            console.log("📝 Committed changes.");
        } catch (e) {
            if (e.stdout && e.stdout.includes("nothing to commit")) {
                console.log("ℹ️ Nothing to commit.");
            } else {
                throw e;
            }
        }

        // Ensure we are on 'main'
        try {
            await execa('git', ['branch', '-M', 'main'], { cwd: projectRoot });
        } catch (e) {}

        // Push
        console.log(`⬆️ Pushing to GitHub...`);
        await execa('git', ['push', '-u', 'origin', 'main'], { cwd: projectRoot });

        return { 
            success: true, 
            repoUrl: `https://github.com/${GITHUB_USERNAME}/${repoName}`,
            message: isNewLocalRepo ? `Successfully created and pushed to https://github.com/${GITHUB_USERNAME}/${repoName}` : `Successfully updated https://github.com/${GITHUB_USERNAME}/${repoName}`
        };

    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        console.error("❌ GitHub Tool Error:", errorMsg);
        return { success: false, error: errorMsg };
    }
}
