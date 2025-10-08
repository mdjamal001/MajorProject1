pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/mdjamal001/MajorProject1.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running Selenium tests...'
                // your teammate’s part will go here eventually
            }
        }

        stage('Notify Deploy') {
            steps {
                echo 'Render will automatically deploy once this push is complete.'
            }
        }
    }
}
