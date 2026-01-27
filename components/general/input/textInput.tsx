import {ChangeEventHandler} from 'react';
 
interface TextInputProps{
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement>
}

export const TextInput = ({value, onChange} : TextInputProps) => 
  <input className="border-b" value={value} onChange={onChange}/>
