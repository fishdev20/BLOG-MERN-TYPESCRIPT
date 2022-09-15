import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import BlogPreview from '../components/BlogPreview';
import ErrorText from '../components/ErrorText';
import Header from '../components/Header';
import LoadingComponent from '../components/LoadingComponent';
import Navigation from '../components/Navigation';
import config from '../config/config';
import logging from '../config/logging';
import IBlog from '../interfaces/blog';
import IPageProps from '../interfaces/page';
import IUser from '../interfaces/user';

const HomePage: React.FunctionComponent<IPageProps> = props => {
    const [blogs, setBlogs] = useState<IBlog[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')


    useEffect(() => {
        GetAllBlogs()
    
      
    }, [])

    const GetAllBlogs = async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/blogs`
            })
            if (response.status === 200 || response.status === 304) {
                let blogs = response.data.blogs as IBlog[]
                blogs?.sort((x,y) => y.updatedAt.localeCompare(x.updatedAt))
                setBlogs(blogs)
            }
        }catch(err) {
            logging.error(err)
            setError('Unable to retreive blogs!')
        }finally {
            setTimeout(() => {
                setLoading(false)
            },1000)
        }
    }
    if(loading) {
        return <LoadingComponent>Loading blogs ...</LoadingComponent>
    }
    return (
        <Container fluid className="p-0">
            <Navigation />
            <Header
                headline="Check out what people have to say"
                title="A Nerdy Blog Website"
            />
            <Container className='mt-5'>
                {blogs?.length === 0 && <p>There are no blogs yet, you should <Link to='/edit'>post</Link> one !</p>}
                {blogs?.map((blog,index) => {
                    return (
                        <div key={index}>
                            <BlogPreview
                                _id={blog._id}
                                author={(blog.author as IUser).name}
                                headline={blog.headline}
                                title={blog.title}
                                createdAt={blog.createdAt}
                                updatedAt={blog.updatedAt}
                            />
                            <hr />
                        </div>
                    )
                })}
                <ErrorText error={error} />
            </Container>
           
        </Container>
    )
 }

export default HomePage;