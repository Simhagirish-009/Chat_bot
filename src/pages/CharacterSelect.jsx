import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import kakashiImg from "../assets/Kakashi1.jpg";
import narutoImg from "../assets/Naruto2.png";
import sasukeImg from "../assets/Sasuke1.jpg";
import sanemiImg from "../assets/Sanemi.jpg";
import rengokuImg from "../assets/Rengoku1.jpeg";
import tanjiroImg from "../assets/Tanjiro.jpg";
import shinobuImg from "../assets/Shinobu.jpg";
import itachiImg from "../assets/Itachi.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const characters = [
  { name: "Naruto Uzumaki", img: narutoImg, theme: "orange" },
  { name: "Sasuke Uchiha", img: sasukeImg, theme: "blue" },
  { name: "Kakashi Hatake", img: kakashiImg, theme: "gray" },
  { name: "Itachi Uchiha", img: itachiImg, theme: "maroon" },
  { name: "Sanemi Shinazugawa", img: sanemiImg, theme: "green" },
  { name: "Kyojuro Rengoku", img: rengokuImg, theme: "red" },
  { name: "Tanjiro Kamado", img: tanjiroImg, theme: "teal" },
  { name: "Shinobu Kocho", img: shinobuImg, theme: "purple" },
];

export default function CharacterSelect() {
  const navigate = useNavigate();

  const handleSelect = (char) => {
    navigate("/charchat", { state: { character: char } }); // 👈 Pass full character object
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 fw-bold">Select Your Character</h2>
      <Row className="g-4 justify-content-center">
        {characters.map((char) => (
          <Col key={char.name} xs={12} sm={6} md={4} lg={3}>
            <Card className="shadow-lg border-0 h-100 text-center">
              <Card.Img
                variant="top"
                src={char.img}
                alt={char.name}
                style={{
                  height: "250px",
                  objectFit: "contain",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />
              <Card.Body>
                <Card.Title>{char.name}</Card.Title>
                <Button variant="primary" onClick={() => handleSelect(char)}>
                  Chat
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
