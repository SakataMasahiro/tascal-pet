import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const products = [
  { name: 'Tascal Pet スターター', amount: 9800, key: 'STARTER' },
  { name: 'Tascal Pet スタンダード', amount: 19800, key: 'STANDARD' },
  { name: 'Tascal Pet プロ', amount: 29800, key: 'PRO' },
]

async function main() {
  console.log('Stripe商品・価格を作成しています...\n')

  for (const p of products) {
    const product = await stripe.products.create({
      name: p.name,
      description: `Tascal Pet ${p.name.replace('Tascal Pet ', '')}プラン（月額¥${p.amount.toLocaleString()}）`,
    })

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: p.amount,
      currency: 'jpy',
      recurring: { interval: 'month' },
    })

    console.log(`✓ ${p.name}`)
    console.log(`  Product ID: ${product.id}`)
    console.log(`  Price ID:   ${price.id}`)
    console.log(`  STRIPE_PRICE_${p.key}=${price.id}\n`)
  }

  console.log('.env.localに上記のSTRIPE_PRICE_*を追加してください。')
}

main().catch(console.error)
