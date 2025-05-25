import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BootstrapForm, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
});

const Login = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <h2 className="mb-4">Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/user/login`,
              {
                email: values.email,
                password: values.password,
              }
            );

            const { token } = response.data.data;
            const decoded = jwtDecode(token);
            const userId = decoded.userId || decoded.id || decoded._id;
            localStorage.setItem('userId', userId);
            // localStorage.setItem('token', token);

            toast.success('Login successful!');
            console.log('✅ Login response:', response.data);

            resetForm();
            navigate('/videos');
          } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            const errorMessage =
              error.response?.data?.message ||
              error.response?.data?.error ||
              'Login failed!';
            toast.error(errorMessage);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            {/* Email */}
            <BootstrapForm.Group className="mb-3" controlId="loginEmail">
              <BootstrapForm.Label>Email address</BootstrapForm.Label>
              <Field
                name="email"
                type="email"
                placeholder="Enter email"
                className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''
                  }`}
              />
              <ErrorMessage
                component="div"
                name="email"
                className="invalid-feedback"
              />
            </BootstrapForm.Group>

            {/* Password */}
            <BootstrapForm.Group className="mb-3" controlId="loginPassword">
              <BootstrapForm.Label>Password</BootstrapForm.Label>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''
                  }`}
              />
              <ErrorMessage
                component="div"
                name="password"
                className="invalid-feedback"
              />
            </BootstrapForm.Group>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            <div className="mt-3 text-center">
              <p>Don't have an account?</p>
              <Button
                variant="primary"
                onClick={() => navigate('/signup')}
              >
                Go to Sign Up
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
