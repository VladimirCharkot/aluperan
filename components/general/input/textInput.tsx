import {ChangeEventHandler} from 'react';
 
interface TextInputProps{
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement>
}

export const TextInput = ({value, onChange} : TextInputProps) => 
  <input className="border-b bg-indigo-50 p-1 rounded w-full" value={value} onChange={onChange}/>
