@Library('aboe026') _ // groovylint-disable-line VariableName, UnusedVariable

import org.aboe026.ShieldsIoBadges

node {
    def workDir = "${WORKSPACE}/${env.BRANCH_NAME}-${env.BUILD_ID}"
    def nodeImage = 'node:18'
    def badges = new ShieldsIoBadges(this, 'node-update-dependencies')
    def upload = env.BRANCH_NAME == 'main'
    def exceptionThrown = false
    def packageJson

    try {
        timeout(time: 20, unit: 'MINUTES') {
            ansiColor('xterm') {
                dir(workDir) {
                    stage('Prep') {
                        checkout scm

                        def packageJsonName = 'package.json'
                        packageJson = readJSON file: packageJsonName
                        projectName = packageJson.name.split('/')[0].replace('@', '')
                        currentBuild.displayName = "${packageJson.version}+${env.BUILD_ID}"
                    }
                    stage('Pull Images') {
                        sh "docker pull ${nodeImage}"
                    }

                    docker.image(nodeImage).inside {
                        stage('Install') {
                            // sh 'node --version'
                            // sh 'yarn --version'
                            sh 'yarn install --immutable'
                        }
                        stage('Lint') {
                            // sh 'yarn lint'
                        }
                        stage('Build') {
                            sh 'yarn build'
                        }
                        stage('Unit Test') {
                            // try {
                            //     sh 'yarn test-unit-ci'
                            // } catch (err) {
                            //     exceptionThrown = true
                            //     println 'Exception was caught in try block of unit tests stage.'
                            //     println err
                            // } finally {
                            //     junit testResults: 'test-results/unit.xml', allowEmptyResults: true
                            //     recordCoverage(
                            //         skipPublishingChecks: true,
                            //         sourceCodeRetention: 'EVERY_BUILD',
                            //         tools: [
                            //             [
                            //                 parser: 'COBERTURA',
                            //                 pattern: 'coverage/cobertura-coverage.xml'
                            //             ]
                            //         ]
                            //     )
                            //     if (upload) {
                            //         badges.uploadCoverageResult(
                            //             branch: env.BRANCH_NAME
                            //         )
                            //     }
                            // }
                        }
                        stage('E2E Test') {
                            // try {
                            //     sh 'yarn test-e2e-ci'
                            // } catch (err) {
                            //     exceptionThrown = true
                            //     println 'Exception was caught in try block of e2e tests stage.'
                            //     println err
                            // } finally {
                            //     junit testResults: 'test-results/e2e.xml', allowEmptyResults: true
                            // }
                        }

                        // if (upload) {
                        if (true) {
                            stage('Nexus Upload') {
                                // upload to private nexus
                                withCredentials([
                                    usernamePassword(credentialsId: 'NEXUS_CREDENTIALS', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')
                                ]) {
                                    withEnv([
                                        'YARN_NPM_PUBLISH_REGISTRY=http://localhost:8081/repository/update-dependencies/',
                                        "YARN_NPM_AUTH_IDENT=${NEXUS_USERNAME}:${NEXUS_PASSWORD}"
                                    ]) {
                                        sh 'yarn npm login --publish'
                                        sh "yarn npm publish --tag=${packageJson.version}"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        exceptionThrown = true
        println 'Exception was caught in try block of jenkins job.'
        println err
    }  finally {
        if (upload) {
            badges.uploadBuildResult(
                branch: env.BRANCH_NAME
            )
        }
        stage('Cleanup') {
            try {
                sh "rm -rf ${workDir}"
            } catch (err) {
                println 'Exception deleting working directory'
                println err
            }
            try {
                sh "rm -rf ${workDir}@tmp"
            } catch (err) {
                println 'Exception deleting temporary working directory'
                println err
            }
            if (exceptionThrown) {
                error('Exception was thrown earlier')
            }
        }
    }
}
