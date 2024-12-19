import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Button, Container, Spinner, Table, Card, Alert } from "react-bootstrap";
import { FaCalendar } from "react-icons/fa";
function Reservas(){
    const [reservas, setReservas] = useState(null)
    const [reservasFiltradas, setReservasFiltradas] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null);
    const [canchas, setCanchas] = useState([]);
    const [canchaId, setCanchaId] = useState("");
    const [dia, setDia] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/reservas")
            .then((response) => {
                setReservas(response.data)
                setReservasFiltradas(response.data)
                console.log("respuesta API:")
                console.log(response.data)
                console.log("reservas:")
                console.log(reservas)
                setCargando(false)
            }).catch(() => setError("Error al cargar las reservas"))
        axios.get("http://localhost:8000/canchas")
        .then((response) => {
            setCanchas(response.data)
        }).catch(() => setError("Error al cargar las canchas"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const borrarReserva = (id) => {
        axios.delete(`http://localhost:8000/reserva/${id}`)
            .then(() => {
                setReservas(reservas.filter(reserva => reserva.Id !== id));
            })
            .catch((error) => {
                console.error("Error al eliminar la reserva:", error);
                setError(error.data)
            });
    };
    const cargarDatosReservas = () => {
        const content = reservasFiltradas.map(reserva =>
            <tr key={reserva.Id}>
                <td className="text-center">{reserva.Id}</td>
                <td>{reserva.Dia}</td>
                <td>{reserva.Hora}</td>
                <td className="text-center">{reserva.Duracion} Min</td>
                <td>{reserva["Telefono contacto"]}</td>
                <td>{reserva["Nombre contacto"]}</td>
                <td className="text-center">{reserva.Cancha.id}</td>
                <td className="text-center">
                    <Button variant="warning" href={`/editarReserva?id=${reserva.Id}`}>Editar</Button>
                </td>
                <td className="text-center">
                    <Button variant="danger" onClick={() => borrarReserva(reserva.Id)}>Borrar</Button>
                </td>
            </tr>
        )
        return <tbody>{content}</tbody>
    }

    const mostrarReservas = () => {
        return(
            <Card>
            <Card.Header as="h5">Lista de Reservas</Card.Header>
            <Card.Body>
                <Table striped bordered hover responsive className="table-aligned">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: "5%" }}>Id</th>
                            <th style={{ width: "15%" }}>Día</th>
                            <th style={{ width: "10%" }}>Hora Inicio</th>
                            <th className="text-center" style={{ width: "10%" }}>Duración</th>
                            <th style={{ width: "15%" }}>Teléfono de Contacto</th>
                            <th style={{ width: "20%" }}>Nombre de Contacto</th>
                            <th className="text-center" style={{ width: "10%" }}>Id Cancha</th>
                            <th colSpan={2} className="text-center" style={{ width: "15%" }}>Acciones</th>
                        </tr>
                    </thead>
                    {cargarDatosReservas()}
                </Table>
            </Card.Body>
        </Card>
        ) 
    }
    const filtrarReservas = () => {
        let reservasFiltradas = reservas;

        
        if (canchaId) {
            reservasFiltradas = reservasFiltradas.filter(
                (reserva) => reserva.Cancha.id === parseInt(canchaId)
            )
        }

        
        if (dia) {
            reservasFiltradas = reservasFiltradas.filter(
                (reserva) => reserva.Dia === dia
            )
        }

        setReservasFiltradas(reservasFiltradas);
    }

    const borrarFiltros = () => {
        setCanchaId("")
        setDia("")
        setReservasFiltradas(reservas)
    }
    const onChangeCanchaId = (event) => {
        setCanchaId(event.target.value)
    }

    const onChangeDia = (event) => {
        setDia(event.target.value)
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
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3">
                        <Form.Group controlId="canchaId" className="mb-3">
                            <Form.Label>Cancha</Form.Label>
                            <Form.Select value={canchaId} onChange={onChangeCanchaId}>
                                <option value="">Todas las canchas</option>
                                {canchas.map((cancha) => (
                                    <option key={cancha.Id} value={cancha.Id}>
                                        {cancha.Nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="dia" className="mb-3">
                            <Form.Label><FaCalendar style={{ marginRight: "5px" }} /> Día</Form.Label>
                            <Form.Control
                                type="date"
                                value={dia}
                                onChange={onChangeDia}
                            />
                        </Form.Group>
                    </div>
                    <div>
                        <Button variant="primary" className="me-4" onClick={filtrarReservas}>
                            Filtrar
                        </Button>
                        <Button variant="secondary" onClick={borrarFiltros}>
                            Borrar Filtros
                        </Button>
                    </div>
                </div>
            </Form>
            {reservas.length > 0 ? mostrarReservas() : <p>No hay reservas disponibles.</p>}
        </Container>
    )
}
export default Reservas