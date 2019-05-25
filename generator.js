const hrstart = process.hrtime()
const faker = require('faker/locale/pt_BR')
const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))
const JSONStream = require('JSONStream')

const wstream = fs.createWriteStream(__dirname + '/' + args._[0], { flags: 'w' })
const transformStream = JSONStream.stringify()

let totalObjects = 0;

wstream.on('open', () => {
    console.info('Initiating the generation of fake objects ...', args.n)
})

wstream.on('close', function () {
    const hrend = process.hrtime(hrstart)
    console.info('Total of generated objects: %d', totalObjects)
    console.info('Runtime: %ds %dms', hrend[0], hrend[1] / 1000000)
    const used = process.memoryUsage();
    for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - -");
})

transformStream.pipe(wstream);
for (; totalObjects < args.n; totalObjects++) {
    process.stdout.write("Processing object number: " + (totalObjects + 1) + "\r")
    transformStream.write({
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        job: faker.name.jobTitle(),
        address: faker.address.streetAddress() + ', ' + faker.address.streetName(),
        city: faker.address.city(),
        country: faker.address.country(),
        company: faker.company.companyName()
    })
}
transformStream.end();

wstream.end()