
import { useAssets } from '../contex/AssetsContext';


export default function AssetsProvider() {

    const {assets, setAssets, handleUploadFile } = useAssets()

    const handleDel = (id: string) => {
        setAssets(assets.filter((el) => el.id !== id))
    }

    const elem = assets.map(({id, name, url}) => {
        return(
            <div className='block_images' key={id}>
                <img src={url} width={50}/>
                <p style={{fontSize: 16}}>{name}</p>
                <button className='del_btn' onClick={() => handleDel(id)}>X</button>
            </div>
        )
    })
    return (
        <div className='assets_block'>
            <div style={{marginBottom: 20}}>
                <input className='btn_input_type_file' type='file' accept='image/png, image/jpeg, image/webp, image/svg+xml' onChange={handleUploadFile} />
            </div>
            <div className='block_card'>
                {elem}
            </div>
        </div>
    )
}
