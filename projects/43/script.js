document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointmentForm');

    appointmentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(appointmentForm);

        // Here you can add logic to handle the form submission, such as sending data to a server
        console.log('Appointment Form Submitted:', Object.fromEntries(formData.entries()));

        // Optionally, reset the form after submission
        appointmentForm.reset();
    });
});