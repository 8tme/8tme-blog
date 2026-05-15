import fs, { read } from 'fs'
import path from 'path'

const filename = path.resolve(__dirname, 'a.txt')

// fs.unlink // 删除文件


const readStream = fs.createReadStream(filename, {
  encoding: 'utf-8',
  // autoClose: true,
  highWaterMark: 1,
})

const writeStream = fs.createWriteStream(filename, {
  encoding: 'utf-8',
  autoClose: true,
  highWaterMark: 1,
})

readStream.pipe(writeStream)

// let pending = false

readStream.on('data', (chunk) => {
  console.log(chunk)
  // pending = writeStream.write(chunk)

  // if (pending) {
  //   readStream.pause()
  // }
})

// writeStream.on('drain', () => {
//   readStream.resume()
// })

readStream.on('end', () => {
  console.log('end')
})

readStream.on('error', (err) => {
  console.log(err)
})
