
git add .gitlab-ci.yml
git commit -m "Move .gitlab-ci.yml to root directory"
git push gitlab master

for cypress in the .gitlab_ci.yml
run_cypress_tests:
  image: cypress/browsers:node-20.14.0-chrome-125.0.6422.141-1-ff-126.0.1-edge-125.0.2535.85-1
  script:
    - npm ci
    - npm run build
    - npm start &
    - npx wait-on http://localhost:3000
    - npm run cypress:run
