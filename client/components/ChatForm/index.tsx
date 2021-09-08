import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardEvent } from 'react';

interface Message {
  message: string;
}

const ChatForm = ({
  addMessage
}: {
  addMessage: (message: string) => void;
}) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Message>();

  const onSubmit: SubmitHandler<Message> = (data) => {
    addMessage(data.message);
    reset();
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit(onSubmit);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <Container>
        <Row>
          <Col className='d-flex' xs='auto' sm={12}>
            <Form.Control
              type='text'
              placeholder='Send Message'
              onKeyPress={handleKeyPress}
              {...register('message', { required: true })}
            />
            <Button
              className='ms-3 fw-bold primary__btn'
              variant='primary'
              type='submit'
            >
              Send
            </Button>
          </Col>
        </Row>

        <Row>
          <Form.Text className='tx-nlight my-sm-1'>
            {!errors.message
              ? 'Never send sensitive data.'
              : 'The message is required to continue.'}
          </Form.Text>
        </Row>
      </Container>
    </Form>
  );
};

export default ChatForm;
