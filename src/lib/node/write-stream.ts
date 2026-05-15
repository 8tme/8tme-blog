import fs from 'fs'
import path from 'path'

const filename = path.resolve(__dirname, 'a.txt')

const writeStream = fs.createWriteStream(filename, {
  encoding: 'utf-8',
  autoClose: true,
  highWaterMark: 1,
})

writeStream.on('data', (chunk) => {
  console.log(chunk)
})

writeStream.on('end', () => {
  console.log('end')
})

writeStream.on('error', (err) => {
  console.log(err)
})

const done = writeStream.write('1234567890')
writeStream.write('1234567890')