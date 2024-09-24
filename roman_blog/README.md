
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

    ssh key: Enter same passphrase again: my password w. o. _ + endings
Your identification has been saved in C:\Users\User/.ssh/id_rsa.
Your public key has been saved in C:\Users\User/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:gAqYgi5spxXdrdjyX7b0fQwsZnvtVHlYEj2YkRcY2wY user@DESKTOP-9955Q8J
The key's randomart image is:
+---[RSA 3072]----+
|             EOo.|
|o.  ... .    =++.|
|*  ..... .   .ooo|
|+. .. o..     .+.|
|.+.o o oS    ...o|
|o +   o     + o o|
| .     .   * o +.|
|        . + + o.+|
|         . . o oo
other mkdir .ssh in User and then ssh-keygen -t rsa -b 4096 -f C:\Users\User\.ssh\digital_ocean_key
type C:\Users\User\.ssh\digital_ocean_key.pub
ssh root@164.92.246.166
sh
ping ipAdress
traceroute ipAdress


ssh root@ipAdress



