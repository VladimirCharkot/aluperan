import { useState } from "react";

import { Modal } from "../display/modal";
import { P } from "../display/p";
import { PError } from "../display/perror";
import { PSuccess } from "../display/psuccess";

import { Boton } from "../input/boton";
import { TextInput } from "../input/textInput";

import axios from "axios";


export const ModalCambiarPass = ({ cerrar }: any) => {

  const [newPass, setNewPass] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const valido = newPass.length > 9
  const putPass = async () => {
    try {
      if (valido) {
        const r = await axios.put('/api/login', { new_password: newPass })
        if (r.status == 200) {
          setSuccessMsg('Password actualizada!')
        } else {
          setErrorMsg(r.data.message)
        }
        console.log(r)
        setTimeout(cerrar, 1000)
      }
    } catch (e) {
      setErrorMsg(`Error inesperado: ${(e as Error).message}`)
    }
  }

  return (
    <Modal cerrar={cerrar}>

      <p className="font-bold text-xl">Nueva contraseña:</p>
      <p className='text-xs pb-4 text-slate-500'>(La contraseña debe tener 10 o más caracteres)</p>

      <input className="bg-slate-50 p-2 rounded-xl" placeholder="Ingresa la nueva contraseña" value={newPass} onChange={(e) => setNewPass(e.target.value)} />

      <button className="flex disabled:bg-slate-100 disabled:text-slate-400 p-2 mt-2 rounded-md w-fit bg-emerald-500 text-white self-center"
        disabled={!valido}
        onClick={putPass}>
        Cambiar
      </button>


      {successMsg && <PSuccess>{successMsg}</PSuccess>}
      {errorMsg && <PError>{errorMsg}</PError>}
    </Modal>
  )
}