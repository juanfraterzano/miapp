import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Container, Form, Spinner, Row, Col, Alert, Card  } from "react-bootstrap"
import { useNavigate, useSearchParams } from "react-router-dom"
import { FaCalendar, FaClock, FaUser, FaPhone } from "react-icons/fa";

function FormReserva(){
    const [searchParams] = useSearchParams()
    const [dia, setDia] = useState("")
    const [hora, setHora] = useState("")
    const [duracionHoras, setDuracionHoras] = useState(1)
    const [duracionMinutos, setDuracionMinutos] = useState(0)
    const [telefonoContacto, setTelefonoContacto] = useState(0)
    const [nombreContacto, setNombreContacto] = useState("")
    const [canchaId, setCanchaId] = useState(0)
    const [cargando, setCargando] = useState(true)
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [canchas, setCanchas] = useState([])
    const [validationErrors, setValidationErrors] = useState([])

    useEffect(() => {
        const id = searchParams.get("id")
        
        if (id) {
            //Edit
            axios.get("http://localhost:8000/reservas/id/" + id).then(
                (response) => {
                    console.log(response.data)
                    setDia(response.data.dia)
                    setHora(response.data.hora)
                    const duracionTotal = response.data.duracion
                    setDuracionHoras(Math.floor(duracionTotal / 60))
                    setDuracionMinutos(duracionTotal % 60)
                    setTelefonoContacto(response.data.telefono_contacto)
                    setNombreContacto(response.data.nombre_contacto)
                    setCanchaId(response.data.cancha_id)
                }
            ).catch(() => {
                setError("Error al cargar la reserva.");
            });
        }
        axios.get("http://localhost:8000/canchas").then((response) => { setCanchas(response.data) }).catch(() => {
            setError("Error al cargar la reserva.");
        });
        setCargando(false)
    }, [searchParams])

    const validateForm = () => {
        const errors = [];
        // Validar día
        if (!dia) {
            errors.push("La fecha es obligatoria");
        } else {
            // Validar que la fecha sea válida
            const fechaIngresada = new Date(Date.parse(dia + 'T00:00:00'));
            if (isNaN(fechaIngresada.getTime())) {
                errors.push("La fecha ingresada no es válida");
            } else {
                // Validar que el día no sea anterior al día actual
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                if (fechaIngresada < hoy) {
                    errors.push("El día seleccionado no puede ser anterior al día actual");
                }
            }
        }
        // Validar hora
        if (!hora) {
            errors.push("La hora es obligatoria");
        }else{
            const horaSeleccionada = parseInt(hora.split(':')[0], 10);
            if((horaSeleccionada >= 22 || horaSeleccionada < 8))
                errors.push("La hora debe estar entre las 8am y las 22pm");
        }
        // Validar duración
        if (duracionHoras === 0 && duracionMinutos === 15) {
            errors.push("La duración mínima debe ser mayor a 15 minutos");
        }else if(duracionHoras===2 && duracionMinutos>0){
            errors.push("La duración mínima debe ser menor a 2 horas");
        }
        // Validar teléfono de contacto
        if (!/^\d{6,}$/.test(telefonoContacto)) {
            errors.push("El teléfono de contacto debe tener al menos 6 números y solo debe contener digitos");
        }
        // Validar nombre de contacto
        if (!nombreContacto.trim()) {
            errors.push("El campo 'Nombre de contacto' es obligatorio");
        }

        setValidationErrors(errors);
        return errors.length === 0;
    }

    const enviarDatos = (e) => {
        if (!validateForm()) {
            return;
        }
        setCargando(true)
        const duracionTotal = duracionHoras * 60 + duracionMinutos
        const data={
            dia,
            hora,
            duracion: duracionTotal,
            telefono_contacto: telefonoContacto,
            nombre_contacto: nombreContacto,
            cancha_id: canchaId
        }
        const id = searchParams.get("id")
        if(id){
            axios.put("http://localhost:8000/reserva/"+id, data).then(() => {
                navigate("/reservas")
                console.log("datos actualizados:")
                console.log("dia:" + data.dia)
                console.log("hora:" + data.hora)
                console.log("duracion:" + data.duracion)
                console.log("telefono_contacto:" + data.telefono_contacto)
                console.log("nombre_contacto:" + data.nombre_contacto)
                console.log("cancha_id:" + data.cancha_id)
            }).catch(err => {
                console.log(err)
                setCargando(false)
                setError(err.response?.data?.detail || "Error al enviar los datos");
            })
        }
        else(
            axios.post("http://localhost:8000/reserva", data).then(() => {
                    navigate("/reservas")
                    console.log("datos enviados:")
                    console.log("dia:" + data.dia)
                    console.log("hora:" + data.hora)
                    console.log("duracion:" + data.duracion)
                    console.log("telefono_contacto:" + data.telefono_contacto)
                    console.log("nombre_contacto:" + data.nombre_contacto)
                    console.log("cancha_id:" + data.cancha_id)
                }
            ).catch(err => {
                console.log(err)
                setCargando(false)
                setError(err.response?.data?.detail || "Error al enviar los datos");
            })
        )
            
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        enviarDatos()
    }
    const onChangeDia = (e) => {
        e.preventDefault();        
        setDia(e.target.value)
    }

    const onChangeDuracionHoras = (e) => {
        setDuracionHoras(Number(e.target.value))
    }

    const onChangeDuracionMinutos = (e) => {
        setDuracionMinutos(Number(e.target.value))
    }
    const onChangeHora = (e) => {
        e.preventDefault();
        setHora(e.target.value)
    }
    const onChangeTelefonoContacto = (e) => {
        e.preventDefault();
        setTelefonoContacto(e.target.value)
    }
    const onChangeNombreContacto = (e) => {
        e.preventDefault();
        setNombreContacto(e.target.value)
    }
    const onChangeCanchaId = (e) => {
        e.preventDefault();
        setCanchaId(e.target.value)
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
                    {searchParams.get("id") ? "Editar Reserva" : "Crear Nueva Reserva"}
                </Card.Header>
                <Card.Body>
                    {error && (
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error}
                        </Alert>
                    )}
                    {validationErrors.length > 0 && (
                        <Alert variant="danger">
                            <ul>
                                {validationErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3" controlId="dia">
                            <Form.Label><FaCalendar style={{ marginRight: "5px" }} /> Día</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={dia} 
                                onChange={onChangeDia} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="hora">
                            <Form.Label><FaClock style={{ marginRight: "5px" }} /> Hora</Form.Label>
                            <Form.Control 
                                type="time" 
                                value={hora} 
                                onChange={onChangeHora} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaClock style={{ marginRight: "5px" }} /> Duración</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Select value={duracionHoras} onChange={onChangeDuracionHoras}>
                                        {[0, 1, 2].map((h) => (
                                            <option key={h} value={h}>{h} hora{h !== 1 ? "s" : ""}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Select value={duracionMinutos} onChange={onChangeDuracionMinutos}>
                                        {[0, 15, 30, 45].map((m) => (
                                            <option key={m} value={m}>{m} minuto{m !== 1 ? "s" : ""}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row> 
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="telefonoContacto">
                            <Form.Label><FaPhone style={{ marginRight: "5px" }} /> Teléfono de contacto</Form.Label>
                            <Form.Control 
                                type="tel" 
                                placeholder="Ingrese el teléfono de contacto" 
                                value={telefonoContacto} 
                                onChange={onChangeTelefonoContacto} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="nombreContacto">
                            <Form.Label><FaUser style={{ marginRight: "5px" }} /> Nombre de contacto</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingrese el nombre de contacto" 
                                value={nombreContacto} 
                                onChange={onChangeNombreContacto} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="canchaId">
                            <Form.Label>Cancha</Form.Label>
                            <Form.Select value={canchaId} onChange={onChangeCanchaId}>
                                {canchas.map((cancha) => (
                                    <option key={cancha.Id} value={cancha.Id}>
                                        {cancha.Nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="success" type="submit">
                                {searchParams.get("id") ? "Actualizar" : "Crear"} Reserva
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}
export default FormReserva