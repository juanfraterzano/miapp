import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Container, Form, Spinner, Card, Alert } from "react-bootstrap"
import { useNavigate, useSearchParams } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
function FormCanchas(){
    const [searchParams] = useSearchParams()
    const [nombre, setNombre] = useState("")
    const [techada, setTechada] = useState(false)
    const [cargando, setCargando] = useState(true)
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    useEffect(() => {
        const id = searchParams.get("id")
        if (id) {
            //Edit
            axios.get("http://localhost:8000/canchas/id/" + id).then(
                (response) => {
                    setNombre(response.data.nombre)
                    setTechada(response.data.techada)
                }
            )
        }
        setCargando(false)
    }, [searchParams])
    const enviarDatos = (e) => {
        setCargando(true)
        const data = { 
            nombre, 
            techada: Boolean(techada)
        };
        const id = searchParams.get("id")
        if(id){
            axios.put("http://localhost:8000/cancha/"+id, data).then(
                () => {
                    navigate("/canchas")
                }
            ).catch(err => {
                console.log(err)
                setCargando(false)
                setError(err.response?.data?.detail || err.message || "Error al enviar los datos");
            })
        }
        else{
            axios.post("http://localhost:8000/cancha", data).then(
                () => {
                    navigate("/canchas")
                }
            ).catch(err => {
                console.log(err)
                setCargando(false)
                setError(err.response?.data?.detail || err.message || "Error al enviar los datos");
            })
        }
        
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre.trim()) {
            setError("El campo 'Nombre de contacto' es obligatorio")
            return
        }
        enviarDatos()
    }
    const onChangeNombre = (e) => {
        e.preventDefault();        
        setNombre(e.target.value)
    }
    const onChangeTechada = (e) => {
        e.preventDefault();
        setTechada(e.target.checked)
    }

    if (cargando) {
        return (
            <Container className="text-center mt-5">
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-3">Cargando...</p>
        </Container>
          );        
    }
    return (
        <Container className="mt-5">
            <Card>
                <Card.Header as="h4" className="bg-secondary text-light">
                    {searchParams.get("id") ? "Editar Cancha" : "Crear Nueva Cancha"}
                </Card.Header>
                <Card.Body>
                    {error && (
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-4" controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingrese el nombre de la cancha" 
                                value={nombre} 
                                onChange={onChangeNombre} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="techada">
                            <Form.Check 
                                type="checkbox" 
                                label="¿Es una cancha techada?" 
                                checked={techada} 
                                onChange={onChangeTechada} 
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="success" type="submit">
                            <FaPlus style={{ marginRight: "5px" }} />{searchParams.get("id") ? "Actualizar" : "Crear"} Cancha
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )

}
export default FormCanchas