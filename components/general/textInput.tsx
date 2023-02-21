import {ChangeEventHandler} from 'react';
 
interface TextInputProps{
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement>
}

export const TextInput = ({value, onChange} : TextInputProps) => 
  <input className="bg-transparent border-b outline-none" value={value} onChange={onChange}/>
