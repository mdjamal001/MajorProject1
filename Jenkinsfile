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

        stage('Start Server') {
    steps {
        bat 'start /B node index.js'
        bat 'ping 127.0.0.1 -n 6 > nul'
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
