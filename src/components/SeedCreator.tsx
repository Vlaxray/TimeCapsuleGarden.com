import React from 'react';
import { Form, Button } from 'react-bootstrap';

const SeedCreator = () => {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>descrizione ed espansione piu esplicativa</Form.Label>
        {/*<div className="d-flex gap-2">
          ['Cactus', 'Quercia', 'Rosa'].map(type => (
            <Button key={type} variant="outline-light">
              {type}
            </Button>
          ))}  
        </div> */}
      </Form.Group>
      {/* Altri campi del form */}
    </Form>
  );
};
export default SeedCreator;