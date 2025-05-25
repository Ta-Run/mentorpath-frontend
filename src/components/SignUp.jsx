import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BootstrapForm, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
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
              error.response?.data?.error || // handle { error: "..." } case
              'Signup failed!';

            toast.error(errorMessage);
          } finally {
            setSubmitting(false);
          }
        }}

      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            {/* Email */}
            <BootstrapForm.Group className="mb-3" controlId="formEmail">
              <BootstrapForm.Label>Email address</BootstrapForm.Label>
              <Field
                name="email"
                type="email"
                placeholder="Enter email"
                className={`form - control ${errors.email && touched.email ? 'is-invalid' : ''
                  }`}
              />
              <ErrorMessage
                component="div"
                name="email"
                className="invalid-feedback"
              />
            </BootstrapForm.Group>

            {/* Username */}
            <BootstrapForm.Group className="mb-3" controlId="formUsername">
              <BootstrapForm.Label>Username</BootstrapForm.Label>
              <Field
                name="username"
                type="text"
                placeholder="Enter username"
                className={`form - control ${errors.username && touched.username ? 'is-invalid' : ''
                  }`}
              />
              <ErrorMessage
                component="div"
                name="username"
                className="invalid-feedback"
              />
            </BootstrapForm.Group>

            {/* Password */}
            <BootstrapForm.Group className="mb-3" controlId="formPassword">
              <BootstrapForm.Label>Password</BootstrapForm.Label>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className={`form - control ${errors.password && touched.password ? 'is-invalid' : ''
                  }`}
              />
              <ErrorMessage
                component="div"
                name="password"
                className="invalid-feedback"
              />
            </BootstrapForm.Group>



            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </Button>

            <div className="mt-3 text-center">
              <p>Already have an account?</p>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
              >
                Go to Sign In
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SignUp;
