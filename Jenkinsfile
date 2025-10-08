pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/mdjamal001/MajorProject1.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Start Server') {
            steps {
                // Start server in background
                bat 'start /B node index.js'
                // Wait for few seconds to make sure server is ready
                bat 'timeout /T 5'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Notify Deploy') {
            steps {
                echo 'Tests completed. Ready for deployment to Render.'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Optional: kill node server if needed
        }
    }
}
