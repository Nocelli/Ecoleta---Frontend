import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import axios from 'axios'

import Dropzone from '../../components/DropZone'

import logo from '../../assets/logo.svg'
import './styles.css'

interface Item {
    id: number
    title: string
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState<string>('0')
    const [cities, setCities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState<string>('0')
    const [initialPosition, setInitialPosition] = useState<[number, number]>()
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [selectedFile, setSelectedFile] = useState<File>()

    const history = useHistory()


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setInitialPosition([
                position.coords.latitude,
                position.coords.longitude
            ])
        })
    }, [])

    useEffect(() => {
        api.get('items')
            .then(response => {
                setItems(response.data)
            })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla)
                setUfs(ufInitials)
            })
    }, [])

    useEffect(() => {
        if (selectedUf === '0')
            return

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const citiesNames = response.data.map(city => city.nome)
                setCities(citiesNames)
            })
    }, [selectedUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value
        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected < 0) {
            setSelectedItems([...selectedItems, id])
            return
        }

        setSelectedItems(selectedItems.filter(item => item !== id))
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        if(!selectedFile)
            return

        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [lat, lon] = selectedPosition
        const items = selectedItems

        const data = new FormData()
        data.append('name', name)
        data.append('whatsapp', whatsapp)
        data.append('email', email)
        data.append('uf', uf)
        data.append('city', city)
        data.append('lat', String(lat))
        data.append('lon', String(lon))
        data.append('items', items.join(','))
        data.append('image', selectedFile)

        await api.post('points', data)
        history.push('/')
    }


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="ecoleta" />
                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name='name'
                            id='name'
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name='email'
                                id='email'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name='whatsapp'
                                id='whatsapp'
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name='uf'
                                id='uf'
                                value={selectedUf}
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name='city'
                                id='city'
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Items de coleta</h2>
                        <span>Selecione um ou mais items abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type='submit'>
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
}

export default CreatePoint