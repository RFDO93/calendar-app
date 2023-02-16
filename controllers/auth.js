const {request,response} = require('express')
const bcrypt = require('bcryptjs')
const UsuarioModal = require('../models/UsuarioModel')
const {generarJWT} = require('../helpers/jwt') 

const crearUsuario = async (req = request,res = response) => {

  const {email,password} = req.body

  try {

    const firstUser = await UsuarioModal.findOne({email})

    if(firstUser) {
      return res.status(400).json({
        ok:false,
        msg:'Un usuario existe con ese correo'
      })
    }

    const salt = await bcrypt.genSaltSync()
    req.body.password = await bcrypt.hashSync(password,salt)

    const user = new UsuarioModal(req.body)
    await user.save()

    const token = await generarJWT(user._id,user.name)
  
    res.status(201).json({
      ok:true,
      user:{
        uid:user._id,
        name:user.name,
      },
      token
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok:false,
      msg:"Por favor hable con el administrador."
    })
  }

}

const loginUsuario = async (req = request,res = response) => {
  const {email,password} = req.body

  try {

    const user = await UsuarioModal.findOne({email})

    if(!user) {
      return res.status(400).json({
        ok:false,
        msg:'El usuario no existe con ese correo'
      })
    }

    const validPassword = bcrypt.compareSync(password,user.password)

    if(!validPassword) {
      return res.status(400).json({
        ok:false,
        msg:'Contraseña no valida'
      })
    }

    const token = await generarJWT(user._id,user.name)
    
    res.json({
      ok:true,
      user:{
        uid:user._id,
        name:user.name,
      },
      token
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok:false,
      msg:"Por favor hable con el administrador."
    })
  }

}

const revalidarToken = async (req = request,res = response) => {

  try {

    const {uid,name} = req

    const token = await generarJWT(uid,name)

    res.json({
      ok:true,
      uid,
      name,
      token
    })
    
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      ok:false,
      msg:'Token no válido'
    })
  }
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}