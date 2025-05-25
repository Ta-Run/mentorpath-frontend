import React from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Form as BootstrapForm,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
  username: Yup.string()
    .min(3, 'Too Short!')
    .max(15, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Password too short - should be 6 chars minimum.')
    .required('Required'),
});

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <h2 className="mb-4">Sign Up</h2>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        validationSchema={SignUpSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/user/signup`,
              {
                name: values.username,
                email: values.email,
                password: values.password,
              }
            );
            toast.success('Sign up successful!');
            resetForm();
            navigate('/');
          } catch (error) {
            console.error('Signup error:', error.response?.data || error.message);

            const errorMessage =
              error.response?.data?.message ||
              error.response?.data?.error ||
              'Signup failed!';

            toast.error(errorMessage);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <FormikForm>
            {/* Email */}
            <BootstrapForm.Group className="mb-3" controlId="formEmail">
              <BootstrapForm.Label>Email address</BootstrapForm.Label>
              <Field
                name="email"
                as={BootstrapForm.Control}
                type="email"
                placeholder="Enter email"
                isInvalid={touched.email && !!errors.email}
              />
              <ErrorMessage
                component={BootstrapForm.Control.Feedback}
                name="email"
                type="invalid"
              />
            </BootstrapForm.Group>

            {/* Username */}
            <BootstrapForm.Group className="mb-3" controlId="formUsername">
              <BootstrapForm.Label>Username</BootstrapForm.Label>
              <Field
                name="username"
                as={BootstrapForm.Control}
                type="text"
                placeholder="Enter username"
                isInvalid={touched.username && !!errors.username}
              />
              <ErrorMessage
                component={BootstrapForm.Control.Feedback}
                name="username"
                type="invalid"
              />
            </BootstrapForm.Group>

            {/* Password */}
            <BootstrapForm.Group className="mb-3" controlId="formPassword">
              <BootstrapForm.Label>Password</BootstrapForm.Label>
              <Field
                name="password"
                as={BootstrapForm.Control}
                type="password"
                placeholder="Password"
                isInvalid={touched.password && !!errors.password}
              />
              <ErrorMessage
                component={BootstrapForm.Control.Feedback}
                name="password"
                type="invalid"
              />
            </BootstrapForm.Group>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </Button>

            <div className="mt-3 text-center">
              <p>Already have an account?</p>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Go to Sign In
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </Container>
  );
};

export default SignUp;
