import { GithubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)

        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }


            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
        

    }

    delete(user) {
        const filteredEntries = this.entries.filter( entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('header button')
        addButton.onclick = () => {
            const input = this.root.querySelector('header input')
            
            let value = input.value

            this.add(value)

            input.value = ""
            
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user-info img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user-info h2').textContent = user.name
            row.querySelector('.user-info p').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.user-info a').href = `https://github.com/${user.login}`

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
             <td class="user-info">
                 <a href="" target="_blank">
                     <img src="" alt="">
                     <div class="wrapper-user">
                         <h2>Mayk Brito</h2>
                         <p>/maykbrito</p>
                     </div>
                 </a>
             </td>
             <td class="repositories">123</td>
             <td class="followers">1234</td>
             <td><button class="remove">Remover</button></td>
        `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}