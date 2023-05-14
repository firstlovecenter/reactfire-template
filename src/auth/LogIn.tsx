import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Heading,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from '@chakra-ui/react'
import { useAuth } from 'contexts/AuthContext'
import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { Input } from '@jaedag/admin-portal-core'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

const LogIn = () => {
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const handleClick = () => setShow(!show)
  const { login, currentUser } = useAuth()
  const navigate = useNavigate()

  const initialValues = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
  })

  const onSubmit = async (
    values: typeof initialValues,
    onSubmitProps: FormikHelpers<typeof initialValues>
  ) => {
    const { setSubmitting } = onSubmitProps
    try {
      setSubmitting(true)
      await login(values.email, values.password)
      navigate('/')
    } catch (error) {
      setError('Failed to log in')
    }

    setSubmitting(false)
  }

  return (
    <Container>
      <Center height="80vh">
        <Container>
          <Card>
            <CardBody>
              <Heading textAlign={'center'} marginBottom={4}>
                Log In
              </Heading>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Text>{JSON.stringify(currentUser?.email)}</Text>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {(formik) => (
                  <Form>
                    <Input name="email" label="Email" size="lg" />
                    <InputGroup size="lg" marginY={5}>
                      <Input
                        // paddingRight="4.5rem"
                        name="password"
                        type={show ? 'text' : 'password'}
                        placeholder="Enter password"
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>

                    <Button
                      width="100%"
                      type="submit"
                      size="lg"
                      marginTop={5}
                      isLoading={formik.isSubmitting}
                    >
                      Log In
                    </Button>
                  </Form>
                )}
              </Formik>

              <Container marginTop={3}>
                <Text
                  textAlign="center"
                  color="blue.500"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </Text>
              </Container>
            </CardBody>
          </Card>
          <Center width={'100%'} marginTop={2}>
            <Text>
              Need an account?{' '}
              <Link as={RouterLink} to="/signup">
                Sign Up
              </Link>
            </Text>
          </Center>
        </Container>
      </Center>
    </Container>
  )
}

export default LogIn
