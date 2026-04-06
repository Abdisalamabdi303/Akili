import { execa } from 'execa';
import path from 'path';
import fs from 'fs';

const BASE_DIR = path.join(process.cwd(), "projects");

export async function runCommand(projectId, command) {
    try {
        const projectRoot = path.join(BASE_DIR, projectId);

        if (!fs.existsSync(projectRoot)) {
            return { error: "Project directory not found" };
        }

        // Security: Whitelist allowed commands
        const ALLOWED_COMMANDS = ['npm', 'node', 'ls', 'echo', 'cat'];
        const commandParts = command.split(' ');
        const mainCommand = commandParts[0];

        if (!ALLOWED_COMMANDS.includes(mainCommand)) {
            return { error: "Command not allowed" };
        }

        console.log(`Running command in ${projectRoot}: ${command}`);
        const { stdout, stderr } = await execa(command, {
            cwd: projectRoot,
            shell: true,
            reject: false
        });

        if (stderr) {
            console.warn(`Command stderr: ${stderr}`);
        }

        return {
            success: true,
            stdout,
            stderr
        };
    } catch (error) {
        console.error("Command execution error:", error);
        return { error: error.message };
    }
}
