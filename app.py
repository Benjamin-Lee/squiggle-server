#!flask/bin/python
import logging
import os.path
import os

import pandas as pd
import pyarrow
import xxhash
from flask import Flask, jsonify, render_template, request, url_for, send_from_directory

from aws import exists_on_s3, query_x_range, upload
from squiggle import transform


logging.basicConfig(level=logging.DEBUG)
logging.getLogger('botocore').setLevel(logging.INFO)
logging.getLogger('urllib3').setLevel(logging.INFO)
logging.getLogger('s3transfer').setLevel(logging.INFO)


LOCAL = "AWS_LAMBDA_FUNCTION_NAME" not in os.environ # determine if running on AWS or not (manually set this variable to override)
route = "" if LOCAL else "/dev"
logging.info("Running locally" if LOCAL else "Running on AWS")

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", route=route)

@app.route("/seq_query")
def seq_query():

    seq_hash = str(request.args["seq_hash"])
    method = request.args["method"]

    # takes a seq hash and returns a downsampled region
    logging.debug(f"Getting data for seq ID {seq_hash}")

    if LOCAL:
        df = pd.read_parquet(f"data/{seq_hash}.{method}.parquet.sz")
    else:
        df = query_x_range(f"{seq_hash}.{method}.parquet.sz",
                           request.args.get("x_min"),
                           request.args.get("x_max"))

    logging.debug("Got the data")

    zone = df.loc[(float(request.args.get("x_max", df.x.max())) >= df.x) &
                  (float(request.args.get("x_min", df.x.min())) <= df.x)].values
    zone = zone.tolist()

    # downsample if > 5000 points
    # TODO: ensure that the first and last data points in the range are included
    if len(zone) > 5000:
        downsample = int(len(zone) / 5000)
        logging.debug(f"Downsampling by a factor of {downsample}")
        zone = zone[::downsample]

    return jsonify((seq_hash, zone))

@app.route("/transform", methods=["POST"])
def transform_route():
    print(request.form)
    sequence = request.form["seq"]
    seq_name = request.form["seq_name"]
    method = request.form["method"]

    logging.debug("Hashing seq")
    seq_hash = str(xxhash.xxh64(sequence).intdigest())

    if LOCAL:
        exists = os.path.exists(f"data/{seq_hash}.{method}.parquet.sz")
        logging.debug(f"Found {seq_hash} locally")
    else:
        exists = exists_on_s3(f"{seq_hash}.{method}.parquet.sz")
        logging.debug(f"Found {seq_hash} on S3")

    if not exists:
        logging.debug(f"No previous transformation for {seq_name} found. Transforming...")
        transformed = transform(sequence, method=method)

        logging.debug("Saving transformed data for " + seq_name)
        pd.DataFrame(dict(x=transformed[0], y=transformed[1])).to_parquet(f"data/{seq_hash}.{method}.parquet.sz")

        if not LOCAL:
            logging.debug(f"Uploading {seq_hash} to S3")
            upload(f"{seq_hash}.{method}.parquet.sz")

    return jsonify(True)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon/favicon.ico', mimetype='image/vnd.microsoft.icon')


if __name__ == '__main__':
    app.run(debug=True)
