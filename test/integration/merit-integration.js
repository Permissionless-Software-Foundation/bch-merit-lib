/*
  Integration tests for the merit library.

  To run these tests, send a PSF token to this address:
  simpleledger:qz9l5w0fvp670a8r48apsv0xqek840320c90neac9g
*/

// npm libraries
const assert = require('chai').assert

const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()

// Unit under test
const Merit = require('../../lib/merit')
const uut = new Merit({ bchjs })

describe('#merit', () => {
  describe('#getTokenUtxos', () => {
    it('should return token UTXOs for an SLP address', async () => {
      const addr = 'simpleledger:qz9l5w0fvp670a8r48apsv0xqek840320c90neac9g'

      const utxos = await uut.getTokenUtxos(addr)
      console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      assert.isArray(utxos)
      assert.equal(
        utxos[0].tokenId,
        '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0'
      )
    })

    it('should return token UTXOs for a BCH address', async () => {
      const addr = 'bitcoincash:qz9l5w0fvp670a8r48apsv0xqek840320cf5czgcmk'

      const utxos = await uut.getTokenUtxos(addr)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      assert.isArray(utxos)
      assert.equal(
        utxos[0].tokenId,
        '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0'
      )
    })
  })

  describe('#getTokenQuantity', () => {
    it('should return the PSF tokens held by an address', async () => {
      const addr = 'simpleledger:qrrh8reyhqgrw0ly884snn4llxgs44lkfcly2vlrsh'

      const utxos = await uut.getTokenUtxos(addr)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      const tokenQty = uut.getTokenQuantity(utxos)
      // console.log(`tokenQty: ${tokenQty}`)

      assert.isNumber(tokenQty)
    })
  })

  describe('#calcMerit', () => {
    it('should calculate age and merit', async () => {
      const addr = 'simpleledger:qrrh8reyhqgrw0ly884snn4llxgs44lkfcly2vlrsh'

      const utxos = await uut.getTokenUtxos(addr)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      const hydratedUtxos = await uut.calcMerit(utxos)
      // console.log(`hydratedUtxos: ${JSON.stringify(hydratedUtxos, null, 2)}`)

      assert.isArray(hydratedUtxos)
      assert.property(hydratedUtxos[0], 'isValid')
    })
  })

  describe('#agMerit', () => {
    it('should aggregate merit across multiple UTXOs', async () => {
      const addr = 'simpleledger:qrrh8reyhqgrw0ly884snn4llxgs44lkfcly2vlrsh'

      const merit = await uut.agMerit(addr)
      // console.log(`merit: ${merit}`)

      assert.isNumber(merit)
    })
  })
})
