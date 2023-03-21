const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/route.js']

swaggerAutogen(outputFile, endpointsFiles)