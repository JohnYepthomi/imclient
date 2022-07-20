import React from 'react';
import { useEffect} from 'react';
import '../styles/conversation.css';
import { useSearchParams, useParams } from 'react-router-dom';
import DirectMessages from './conversation types/DirectMessages'

export default function Chat(props) {
  let [searchParams] = useSearchParams();
  const { senderjid } = useParams();
  const source = searchParams.get('source');
  
  useEffect(()=>{
    let $header = document.querySelector('.main-header');
    $header.style.display = 'none';

    return () => $header.style.display = 'block';
  },[]);
  
  return (
    <>
      <DirectMessages senderjid={senderjid}/>
    </>
  )
}
