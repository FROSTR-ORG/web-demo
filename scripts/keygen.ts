import { encode_credentials }  from '@frostr/bifrost/encoder'
import { generate_dealer_pkg } from '@frostr/bifrost/lib'
import QRCode from 'qrcode'

const shares    = parseInt(process.argv[2] ?? '3')
const threshold = parseInt(process.argv[3] ?? '2')

if (threshold > shares) {
  console.error('Threshold must be less than or equal to the number of shares')
  process.exit(1)
}

const pkg = generate_dealer_pkg(threshold, shares)

for (const share of pkg.shares) {
  const credentials = encode_credentials(pkg.group, share)
  console.log(`==== [ Share ${share.idx} Credentials ] `.padEnd(80, '=') + '\n')
  console.log(credentials + '\n')

  // Generate and display QR code with minimal size
  const qrCode = await QRCode.toString(credentials, {
    type: 'terminal',
    small: true,
    scale: 0.5,
    margin: 0,
    errorCorrectionLevel: 'L'
  })
  console.log(qrCode + '\n')
}
