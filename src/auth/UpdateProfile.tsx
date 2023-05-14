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

const UpdateProfile = () => {
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const handleClick = () => setShow(!show)
  const { currentUser, updateEmail, updatePassword } = useAuth()
  const navigate = useNavigate()

  const initialValues = {
    email: currentUser.email,
    password: '',
    passwordConfirm: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6),
    passwordConfirm: Yup.string().oneOf(
      [Yup.ref('password'), undefined],
      'Passwords must match'
    ),
  })

  const onSubmit = async (
    values: typeof initialValues,
    onSubmitProps: FormikHelpers<typeof initialValues>
  ) => {
    const { setSubmitting } = onSubmitProps

    const promises = []
    if (values.email !== currentUser.email) {
      promises.push(updateEmail(values.email ?? ''))
    }
    if (values.password) {
      promises.push(updatePassword(values.password ?? ''))
    }

    try {
      setSubmitting(true)
      await Promise.all(promises)
      navigate('/')
    } catch (error) {
      setError('Failed to update account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <Center height="80vh">
        <Container>
          <Card>
            <CardBody>
              <Heading textAlign={'center'} marginBottom={4}>
                Update Profile
              </Heading>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {(formik) => (
                  <Form>
                    <Input size="lg" name="email" label="Email" />
                    <InputGroup size="md" marginY={5}>
                      <Input
                        // paddingRight="4.5rem"
                        size="lg"
                        name="password"
                        type={show ? 'text' : 'password'}
                        placeholder="Leave blank to keep the same"
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <InputGroup size="md">
                      <Input
                        size="lg"
                        // paddingRight="4.5rem"
                        name="passwordConfirm"
                        type={show ? 'text' : 'password'}
                        placeholder="Leave blank to keep the same"
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>

                    <Button
                      size="lg"
                      width="100%"
                      type="submit"
                      marginTop={5}
                      isLoading={formik.isSubmitting}
                    >
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
          <Center width={'100%'} marginTop={2}>
            <Text>
              Already have an account?{' '}
              <Link as={RouterLink} to="/">
                Cancel
              </Link>
            </Text>
          </Center>
        </Container>
      </Center>
    </Container>
  )
}

export default UpdateProfile
