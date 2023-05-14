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
  Link,
  Text,
} from '@chakra-ui/react'
import { useAuth } from 'contexts/AuthContext'
import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { Input } from '@jaedag/admin-portal-core'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { resetPassword, currentUser } = useAuth()
  const navigate = useNavigate()

  const initialValues = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
  })

  const onSubmit = async (
    values: typeof initialValues,
    onSubmitProps: FormikHelpers<typeof initialValues>
  ) => {
    const { setSubmitting } = onSubmitProps
    try {
      setSubmitting(true)
      await resetPassword(values.email)
      setMessage('Check your inbox for further instructions')
    } catch (error) {
      setError('Failed to reset password')
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
                Password Reset
              </Heading>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert status="success">
                  <AlertIcon />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
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

                    <Button
                      width="100%"
                      type="submit"
                      size="lg"
                      marginTop={5}
                      isLoading={formik.isSubmitting}
                    >
                      Reset Password
                    </Button>
                  </Form>
                )}
              </Formik>

              <Container marginTop={3}>
                <Text
                  textAlign="center"
                  color="blue.500"
                  onClick={() => navigate('/login')}
                >
                  Login
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

export default ForgotPassword
