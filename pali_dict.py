# See: http://flask.pocoo.org/docs/0.10/patterns/sqlite3/
import os
from sqlite3 import dbapi2 as sqlite3
from flask import Flask, g, render_template


app = Flask(__name__)

# Load default config and override config from an environment variable
# See: http://flask.pocoo.org/docs/0.10/config/
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'pali_dict.db'),
    DEBUG=True,
))
app.config.from_envvar('PALI_DICTIONARY_SETTINGS', silent=True)


def connect_db():
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = connect_db()
    return db


@app.teardown_appcontext
def close_connection(exception):
    """Closes the database at the end of the request."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def query_db(query, args=(), one=False):
    cursor = get_db().execute(query, args)
    cursor.fetchone()  # the first row has column names
    rv = cursor.fetchall()
    cursor.close()
    return (rv[0] if rv else None) if one else rv


@app.route('/')
def show_entries():
    entries = query_db("SELECT pali, myanmar FROM pali_myanmar_dictionary LIMIT ?", [10])
    app.logger.debug(str(entries))
    for entry in entries:
        app.logger.debug(unicode(entry['pali']))
    return render_template('index.html', entries=entries)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
