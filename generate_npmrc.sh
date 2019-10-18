cat << EOL >> ".npmrc"
registry=https://registry.npmjs.org
@lundalogik:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_TOKEN}
EOL
