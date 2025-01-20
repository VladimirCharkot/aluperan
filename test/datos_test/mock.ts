import { TallerPost, AlumnePost } from "../../lib/api"

export const talleres: TallerPost[] = [{
  nombre: 'Aro',
  profe: 'Mechita',
  horarios: [{
    dia: 'lun',
    hora: '18:00hs'
  }, {
    dia: 'jue',
    hora: '10:30hs'
  }],
  precios: [1200, 3500, 5000],
  iniciado: new Date(2022, 8)
}, {
  nombre: 'Tela',
  profe: 'Maga',
  horarios: [{
    dia: 'lun',
    hora: '20:00hs'
  }, {
    dia: 'mie',
    hora: '20:00hs'
  }, {
    dia: 'lun',
    hora: '10:30hs'
  }, {
    dia: 'mie',
    hora: '10:30hs'
  }, {
    dia: 'vie',
    hora: '19:00hs'
  }],
  precios: [1400, 4000, 6000, 7500, 9000, 10000],
  iniciado: new Date(2022, 6)
}, {
  nombre: 'Plasticidad en movimiento',
  profe: 'Sofía Naike',
  horarios: [{
    dia: 'mie',
    hora: '17:00hs'
  }],
  precios: [1500, 4500],
  iniciado: new Date(2022, 9)
}, {
  nombre: 'Acro dúo',
  profe: 'Pan y guineo',
  horarios: [{
    dia: 'mie',
    hora: '16:30hs'
  }],
  precios: [1200, 3500],
  iniciado: new Date(2022, 8)
}, {
  nombre: 'Trapecio',
  profe: 'Indra Jazmin',
  horarios: [{
    dia: 'mar',
    hora: '20:00hs'
  }, {
    dia: 'jue',
    hora: '20:00hs'
  },{
    dia: 'sab',
    hora: '12:00hs'
  }],
  precios: [1400, 4000, 5000, 6000],
  iniciado: new Date(2022, 6)
}]

export const alumnes: AlumnePost[] = [{
  nombre: 'Macarena Olivos',
  celular: '1122447563',
  ficha: true
}, {
  nombre: 'Elías Marqueiro',
  celular: '1125279965'
}, {
  nombre: 'Juana Cervio',
  ficha: true
}, {
  nombre: 'Camilo Sanquio',
  celular: '1122412135'
}, {
  nombre: 'Esteban Ramirez',
  ficha: true
}, {
  nombre: 'Antonia Silvera',
  celular: '1122566397',
  ficha: true
}, {
  nombre: 'Eliana Sacarías',
  celular: '1120235453'
}, {
  nombre: 'Abril Estevez',
  ficha: true
}, {
  nombre: 'Carla Porta',
  ficha: true,
  celular: '1144556678'
}, {
  nombre: 'Fernando Miguelete',
  ficha: true
}]

export const inscripcionesPorAlum = 3

export const apertura = new Date(2023, 1, 1)

export const motivosDeGasto = [
  'Compras en el chino',
  'Insumos de limpieza',
  'Gastos de emergencia',
  'Equipo para talleristas',
  'Contratamos limpieza',
  'Agasajo a visitantes',
  'Unas birritas',
  'Ferretería'
]