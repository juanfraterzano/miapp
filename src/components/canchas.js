import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Spinner, Table, Card, Row, Col, Alert } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

function Canchas(){
    const [canchas, setCanchas] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null);
    useEffect(() => {
        try{
        axios.get("http://localhost:8000/canchas")
            .then((response) => {
                console.log("respuesta API:")
                console.log(response.data)
                setCanchas(response.data)
                console.log("canchas:")
                console.log(canchas)
                setCargando(false)
            })}
            catch(error){
                console.log(error)
                setError(error.data)
            }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const borrarCancha = (id) => {
        axios.delete(`http://localhost:8000/cancha/${id}`)
            .then(() => {
                setCanchas(canchas.filter(cancha => cancha.Id !== id));
            })
            .catch((error) => {
                console.error("Error al eliminar la cancha:", error);
                setError(error.data)
            });
    };
    const cargarDatosCanchas = () => {
        const content = canchas.map(cancha =>
            <tr key={cancha.Id}>
                <td className="text-center">{cancha.Id}</td>
                <td>{cancha.Nombre}</td>
                <td className="text-center">{cancha.Techada ? "Sí" : "No"}</td>
                <td className="text-center"><Button variant="warning" href={'/editarCancha?id=' + cancha.Id}><FaEdit style={{ marginRight: "5px" }} />Editar</Button></td>
                <td className="text-center"><Button variant="danger" onClick={() => borrarCancha(cancha.Id)}><FaTrash style={{ marginRight: "5px" }} />Borrar</Button></td>
            </tr>
        )
        return <tbody>{content}</tbody>
    }

    const mostrarCanchas = () => {
        return(
            <Card>
            <Card.Header as="h5">Lista de Canchas</Card.Header>
            <Card.Body>
                <Table striped bordered hover responsive style={{ tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '10%' }}>Id</th>
                            <th style={{ width: '40%' }}>Nombre</th>
                            <th className="text-center" style={{ width: '20%' }}>Techada</th>
                            <th colSpan={2} className="text-center" style={{ width: '15%' }}>Acciones</th>
                        </tr>
                    </thead>
                    {cargarDatosCanchas()}
                </Table>
            </Card.Body>
        </Card>
        ) 
    }
    if (cargando) {
        return (
            <Container className="text-center mt-5">
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p>Cargando...</p>
        </Container>
          );        
    }
    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h1>Gestión de Canchas y Reservas de Paddle</h1>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}

            {canchas && mostrarCanchas()}
        </Container>
    )
}

export default Canchas