# https://www.python.org/dev/peps/pep-0263/
# coding=utf-8

import os
from sqlite3 import dbapi2 as sqlite3
from flask import Flask, g, render_template, jsonify, request, Response
import json


app = Flask(__name__)

# Load default config and override config from an environment variable
# See: http://flask.pocoo.org/docs/0.10/config/
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'pali_dict.db'),
    DEBUG=True,
    JSON_AS_ASCII=False,
))
app.config.from_envvar('PALI_DICTIONARY_SETTINGS', silent=True)


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


# See: http://flask.pocoo.org/docs/0.10/patterns/sqlite3/
def connect_db():
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = dict_factory
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


# See: https://pymotw.com/2/sqlite3/
def query(sql, args=()):
    cursor = get_db().execute(sql, args)
    rows = cursor.fetchall()
    cursor.close()
    return rows


def query_one(sql, args=()):
    cursor = get_db().execute(sql, args)
    row = cursor.fetchone()
    cursor.close()
    return row


@app.errorhandler(404)
def page_not_found(e):
    return jsonify(error=404, text=str(e)), 404


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/myanmar/starts_with/<prefix>')
def myanmar_starts_with(prefix):
    limit = request.args.get("limit", 100)
    limit = 500 if limit > 500 else limit
    skip = request.args.get("skip", 0)
    prefix = prefix + '%'
    list = query("SELECT pali, mm FROM pali_mm WHERE mm like :prefix LIMIT :limit OFFSET :skip",
                 [prefix, limit, skip])
    return jsonify(data=list, limit=limit, skip=skip, length=len(list))


@app.route('/api/myanmar/contains/<substring>')
def myanmar_contains(substring):
    limit = request.args.get("limit", 100)
    limit = 500 if limit > 500 else limit
    skip = request.args.get("skip", 0)
    substring = '%' + substring + '%'
    list = query("SELECT pali, mm FROM pali_mm WHERE mm like :substring LIMIT :limit OFFSET :skip",
                 [substring, limit, skip])
    return jsonify(data=list, limit=limit, skip=skip, length=len(list))


@app.route('/api/root_word/starts_with/<substring>')
def root_word_starts_with(substring):
    limit = request.args.get("limit", 100)
    limit = 500 if limit > 500 else limit
    skip = request.args.get("skip", 0)
    # http://www.tutorialspoint.com/sqlite/sqlite_like_clause.htm
    substring = u'%√_' + substring + '%'
    list = query("SELECT pali, mm FROM pali_mm WHERE mm like :substring LIMIT :limit OFFSET :skip",
                 [substring, limit, skip])
    return jsonify(data=list, limit=limit, skip=skip, length=len(list))


@app.route('/api/pali_myanmar/contains/<substring>')
def pali_myanmar_contains(substring):
    limit = request.args.get("limit", 100)
    limit = 500 if limit > 500 else limit
    skip = request.args.get("skip", 0)
    substring = '%' + substring + '%'
    list = query("SELECT pali, mm FROM pali_mm WHERE pali like :substring or mm like :substring LIMIT :limit OFFSET :skip",
                 [substring, limit, skip])
    return jsonify(data=list, limit=limit, skip=skip, length=len(list))


@app.route('/api/pali/contains/<substring>')
def pali_contains(substring):
    limit = request.args.get("limit", 100)
    limit = 500 if limit > 500 else limit
    skip = request.args.get("skip", 0)
    substring = '%' + substring + '%'
    list = query("SELECT pali, mm FROM pali_mm WHERE pali like :substring LIMIT :limit OFFSET :skip",
                 [substring, limit, skip])
    return jsonify(data=list, limit=limit, skip=skip, length=len(list))


@app.route('/api/pali/starts_with/<prefix>')
def pali_starts_with(prefix):
    limit = request.args.get("limit", 100)
    limit = 500 if limit > 500 else limit
    skip = request.args.get("skip", 0)
    prefix = prefix + '%'
    list = query("SELECT pali, mm FROM pali_mm WHERE pali like :prefix LIMIT :limit OFFSET :skip",
                 [prefix, limit, skip])
    return jsonify(data=list, limit=limit, skip=skip, length=len(list))


@app.route('/api/pali/ends_with/<suffix>')
def pali_ends_with(suffix):
    limit = request.args.get("limit", 100)
    limit = 500 if limit > 500 else limit
    skip = request.args.get("skip", 0)
    suffix = '%' + suffix
    list = query("SELECT pali, mm FROM pali_mm WHERE pali like :suffix LIMIT :limit OFFSET :skip",
                 [suffix, limit, skip])
    return jsonify(data=list, limit=limit, skip=skip, length=len(list))


@app.route('/api/pali/equals/<word>')
def pali_equals(word):
    list = query("SELECT pali, mm FROM pali_mm WHERE pali = ?", [word])
    return jsonify(data=list)


@app.route('/api/pali/letter')
def pali_letter():
    list = query("SELECT letter FROM lookup_letter")
    for ll in list:
        prefix = ll['letter'] + '%'
        r = query_one("SELECT count(*) as count FROM pali_mm WHERE pali like :prefix", [prefix])
        ll['count'] = r['count']
    return jsonify(data=list)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
