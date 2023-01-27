import { expect } from 'chai'
import { DogecoinJS } from '../dist'

// Make a typed wrapper of our distributed bundle
let wrapper: DogecoinJS

describe('Test all address interfaces (mainnet)', () => {
  before(async () => {
    wrapper = await DogecoinJS.init()
  })

  it('generatePrivPubKeypair', () => {
    const [priv, pub] = wrapper.generatePrivPubKeypair()

    expect(pub.length).is.equal(34)
    expect(priv.length).is.equal(52)
  })

  it('generateHDMasterPubKeypair', () => {
    const [priv, pub] = wrapper.generateHDMasterPubKeypair()

    expect(pub.length).is.equal(34)
    expect(priv.length).is.gt(1)
    expect(priv.length).is.lt(112)
  })

  it('generateDerivedHDPubkey', () => {
    const [priv] = wrapper.generateHDMasterPubKeypair()
    const pub = wrapper.generateDerivedHDPubkey(priv)

    expect(pub.length).is.equal(34)
  })

  it('verifyPrivPubKeypair', () => {
    const [priv, pub] = wrapper.generatePrivPubKeypair()
    const valid = wrapper.verifyPrivPubKeypair(priv, pub)

    expect(valid).not.equal(false)
  })

  it('verifyHDMasterPubKeypair', () => {
    const [priv, pub] = wrapper.generateHDMasterPubKeypair()
    const valid = wrapper.verifyHDMasterPubKeypair(priv, pub)

    expect(valid).not.equal(false)
  })

  it('verifyPrivPubKeypair', () => {
    const [, pub] = wrapper.generatePrivPubKeypair()
    const valid = wrapper.verifyP2pkhAddress(pub)

    expect(valid).not.equal(false)
  })
})

describe('Test all address interfaces (testnet)', () => {
  before(async () => {
    wrapper = await DogecoinJS.init()
  })

  it('generatePrivPubKeypair', () => {
    const [priv, pub] = wrapper.generatePrivPubKeypair(true)

    expect(pub.length).is.equal(34)
    expect(priv.length).is.equal(52)
  })

  it('generateHDMasterPubKeypair', () => {
    const [priv, pub] = wrapper.generateHDMasterPubKeypair(true)

    expect(pub.length).is.equal(34)
    expect(priv.length).is.equal(111)
  })

  it('generateDerivedHDPubkey', () => {
    const [priv] = wrapper.generateHDMasterPubKeypair(true)
    const pub = wrapper.generateDerivedHDPubkey(priv)

    expect(pub.length).is.equal(34)
  })

  it('getDerivedHDAddressByPath', () => {
    const [masterPriv] = wrapper.generateHDMasterPubKeypair(true)
    const pubKey = wrapper.getDerivedHDAddressByPath(
      masterPriv,
      `m/44'/3'/0'/0/0`,
      false
    )
    const privKey = wrapper.getDerivedHDAddressByPath(
      masterPriv,
      `m/44'/3'/0'/0/0`,
      true
    )

    expect(pubKey.length).is.equal(111)
    expect(privKey.length).is.equal(111)
  })

  it('verifyPrivPubKeypair', () => {
    const [priv, pub] = wrapper.generatePrivPubKeypair(true)
    const valid = wrapper.verifyPrivPubKeypair(priv, pub, true)

    expect(valid).not.equal(false)
  })

  it('verifyHDMasterPubKeypair', () => {
    const [priv, pub] = wrapper.generateHDMasterPubKeypair(true)
    const valid = wrapper.verifyHDMasterPubKeypair(priv, pub, true)

    expect(valid).not.equal(false)
  })

  it('verifyPrivPubKeypair', () => {
    const [, pub] = wrapper.generatePrivPubKeypair(true)
    const valid = wrapper.verifyP2pkhAddress(pub)
    console.log(pub)
    console.log(valid)
    expect(valid).not.equal(false)
  })
})

describe('Test all transaction interfaces', () => {
  before(async () => {
    wrapper = await DogecoinJS.init()
  })

  it('startTransaction', () => {
    const index = wrapper.startTransaction()

    expect(index).is.not.equal(0)
  })

  it('addUTXO', () => {
    const index = wrapper.startTransaction()
    const valid = wrapper.addUTXO(
      index,
      'b4455e7b7b7acb51fb6feba7a2702c42a5100f61f61abafa31851ed6ae076074',
      1
    )

    expect(valid).not.equal(false)
  })

  it('addOutput', () => {
    const index = wrapper.startTransaction()
    wrapper.addUTXO(
      index,
      'b4455e7b7b7acb51fb6feba7a2702c42a5100f61f61abafa31851ed6ae076074',
      1
    )
    const valid = wrapper.addOutput(
      index,
      'DBKwBLEDY96jBtx1xCmjfBzp9FrNCWxnmM',
      '1.0'
    )

    expect(valid).not.equal(false)
  })

  it('finalizeTransaction', () => {
    const index = wrapper.startTransaction()
    wrapper.addUTXO(
      index,
      'b4455e7b7b7acb51fb6feba7a2702c42a5100f61f61abafa31851ed6ae076074',
      1
    )
    wrapper.addUTXO(
      index,
      '42113bdc65fc2943cf0349ea1a24ced0b6b0b5290db4c63a3329c6601c4616e2',
      1
    )
    wrapper.addOutput(index, 'nbGfXLskPh7eM1iG5zz5EfDkkNTo9TRmde', '5.0')
    const hex = wrapper.finalizeTransaction(
      index,
      'nbGfXLskPh7eM1iG5zz5EfDkkNTo9TRmde',
      '0.00226',
      '12.0',
      'noxKJyGPugPRN4wqvrwsrtYXuQCk7yQEsy'
    )
      console.log(hex)
    expect(hex).not.equal('0')
  })

  it('getRawTransaction', () => {
    const index = wrapper.startTransaction()
    wrapper.addUTXO(
      index,
      'b4455e7b7b7acb51fb6feba7a2702c42a5100f61f61abafa31851ed6ae076074',
      1
    )
    wrapper.addUTXO(
      index,
      '42113bdc65fc2943cf0349ea1a24ced0b6b0b5290db4c63a3329c6601c4616e2',
      1
    )
    wrapper.addOutput(index, 'DBKwBLEDY96jBtx1xCmjfBzp9FrNCWxnmM', '5.0')
    const hex = wrapper.getRawTransaction(index)
    console.log(hex)

    expect(hex).not.equal('0')
  })
})
