import './App.css';
import { useState, useEffect } from "react"
import imageCompression from 'browser-image-compression';

function App() {
  const [selected, setSelected] = useState(null)
  const [compressed, setCompressed] = useState(null)
  const [preview, setSelectedImagePreview] = useState(null)
  const [res, setRes] = useState(null)

  useEffect(() =>{
    setCompressed(null)
  }, [selected])

  function takeFromGallery(e){
    e.preventDefault();
    if(e.target.files[0]){
      setSelected(e.target.files[0])
      setSelectedImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function compressImage(e){
    e.preventDefault();
    const COMPRESSION_LIMIT = 1024 //KB

    if(!selected){
      alert("you have to select image first!")
      return
    }

    if(selected.size / 1000 < COMPRESSION_LIMIT) {
      setRes(selected);
      alert("smaller than 1MB images can not be compressed!")
      return
    }

    const options = { 
      maxSizeMB: 2,          // (default: Number.POSITIVE_INFINITY)
      maxWidthOrHeight: 600,  
      useWebWorker: true,      // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
    }
    const result = await imageCompression(selected, options)
    setRes(result)
    let downloadLink = URL.createObjectURL(result)
    setCompressed(downloadLink)
  }

  return (
    <div className="container">
      <div className="alert">
        <p>
          This example use <span> Browser Image Compression</span> package.<br/>
          You can find it <a target="_blank" rel="noreferrer" href="https://www.npmjs.com/package/browser-image-compression">here</a>.
        </p>
      </div>
      <h1>Image Compression Example</h1>
      

      <input type="file" accept="image/*" className="" onChange={takeFromGallery}/>
      <h4>Size: { selected ? selected.size / 1000 : 0 } KB</h4>

      {
        preview ? <img src={preview} alt="" className="galery-img my" /> : <img src={"/nofile.jpg"} alt="" className="notfound-img my" />
      }
      
      <button className="btn" onClick={compressImage}>Compress Image</button>
      <h4>Compressed Size: { compressed ? res.size / 1000 : 0 } KB</h4>

      {
        compressed ? <img src={compressed} alt="" className="galery-img my" /> : <img src={"/nofile.jpg"} alt="" className="notfound-img my" />
      }
    </div>
  );
}

export default App;
