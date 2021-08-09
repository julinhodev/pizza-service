/* FUNÇÕES AUXILIARES */
const q = (elemento) => document.querySelector(elemento)
const qa= (elemento) => document.querySelectorAll(elemento)

//  Armazenas quantidades do Modal
let modalQt = 1
let cart = []
let modalKey = 0

/* MONTANDO A LISTA DE PIZZA */
pizzaJson.map( (item, index)=> {
    const pizzaItem = q('.models .pizza-item').cloneNode(true)
    
    //Renderizando as informações na tela
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.',',')}`
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    
    //Prevenindo o evento Default da tag " a " para que ao clicar na pizza, a página não atualize!!!
    pizzaItem.querySelector('a').addEventListener('click', evento => {
        evento.preventDefault()

        const key = evento.target.closest('.pizza-item').getAttribute('data-key')
            modalQt = 1
            modalKey = key

        q('.pizzaBig img').src = pizzaJson[key].img
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.',',')}`
       
        q('.pizzaInfo--size.selected').classList.remove('selected')

        qa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            sizeIndex == 2 ? size.classList.add('selected') : ''
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        });

        q('.pizzaInfo--qt').innerHTML = modalQt
        
        //  Abrindo o Modal
        q('.pizzaWindowArea').style.opacity = 0
        q('.pizzaWindowArea').style.display = 'flex'
        setTimeout( () => q('.pizzaWindowArea').style.opacity = 1, 200)
    })

    q('.pizza-area').append( pizzaItem )
} )

// Eventos do MODAL
function closeModal() {
    q('.pizzaWindowArea').style.opacity = 0
    setTimeout( () => q('.pizzaWindowArea').style.display = 'none', 200)
}

qa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( btn => {
    btn.addEventListener('click', closeModal)
} )

q('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++
    q('.pizzaInfo--qt').innerHTML = modalQt
} )

q('.pizzaInfo--qtmenos').addEventListener('click', () => {
    modalQt == 1 ? '' :  modalQt--
    q('.pizzaInfo--qt').innerHTML = modalQt
} )

qa('.pizzaInfo--size').forEach(size => {
    size.addEventListener('click', () => {
        q('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})

q('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'))
    let identifier = `${pizzaJson[modalKey].id}@${size}`
    let key = cart.findIndex( item => item.identifier == identifier )
    if(key > -1){
        cart[key].qt += modalQt
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }
    updateCart()
    closeModal()
})

q('.menu-openner').addEventListener('click', () => {
    updateCart()
    if(cart.length > 0) {
        q('aside').style.left = '0'
    }
})

q('.menu-closer').addEventListener('click', () => {
    updateCart()
    q('aside').style.left = '100vw'
})


function updateCart(){

    q('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0){
        q('aside').classList.add('show')
        q('.cart').innerHTML = ''

        let subtotal = 0
        const desconto = 0.1
        let totalDesconto = 0
        let total = 0

        for(let i in cart){
            let pizzaItem = pizzaJson.find(item => item.id == cart[i].id)
            subtotal += pizzaItem.price * cart[i].qt
            let cartItem = q('.models .cart--item').cloneNode(true)

            let pizzaSizeName = ''
            switch (cart[i].size) {
                case  0:
                    pizzaSizeName = 'P'
                    break
                case 1:
                    pizzaSizeName = 'M'    
                    break
                case 2:
                    pizzaSizeName = 'G'    
                    break
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                cart[i].qt--
                if(cart[i].qt < 1){
                    cart.splice(i, 1)
                }
                updateCart()
            } )
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++
                updateCart()
            } )

            q('.cart').append(cartItem)

            totalDesconto = subtotal * desconto
            total = subtotal - totalDesconto

            q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace('.',',')}`
            q('.desconto span:last-child').innerHTML = `R$ ${totalDesconto.toFixed(2).replace('.',',')}`
            q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace('.',',')}`
        }
    } else {
        q('aside').classList.remove('show')
        q('aside').style.left = '100vw'
    }
}

q('.cart--finalizar').addEventListener('click', () => alert('Compra finalizada com Sucesso!!!'))