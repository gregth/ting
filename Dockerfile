FROM django:python2

RUN mkdir -p /usr/src/{app,config}
WORKDIR /usr/src/app

COPY API/requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt

ADD config/ /usr/src/config/
ADD API/ /usr/src/app/

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
