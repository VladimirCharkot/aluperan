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
    try{
      if (valido) {
        const r = await axios.put('/api/login', { new_password: newPass })
        if (r.status == 200) {
          setSuccessMsg('Password actualizada!')
        }else{
          setErrorMsg(r.data.message)
        }
        console.log(r)
        setTimeout(cerrar, 1000)
      }
    }catch(e){
      setErrorMsg(`Error inesperado: ${(e as Error).message}`)
    }
  }

  return (
    <Modal cerrar={cerrar}>

      <P>Nueva pass:</P>
      <p className='text-xs pb-4'>(10 o más caracteres)</p>
      <TextInput value={newPass} onChange={(e) => setNewPass(e.target.value)} />

      <Boton addons='ml-auto' texto='Cambiar' color='emerald' activo={valido} onClick={putPass} />

      {successMsg && <PSuccess>{successMsg}</PSuccess>}
      {errorMsg   && <PError>{errorMsg}</PError>}
    </Modal>
  )
}