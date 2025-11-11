from fastapi import APIRouter, HTTPException, UploadFile, File
from prisma import Prisma
from core.database import db
import boto3
from botocore.exceptions import NoCredentialsError
import os
from uuid import uuid4

router = APIRouter(prefix='/upload', tags=["uploads"]);

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
REGION = os.getenv("AWS_REGION")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=REGION,
)

@router.post('/pfp')
async def upload_pfp(id: int, file: UploadFile = File(...)):
    try:
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid4()}.{file_extension}"

        s3.upload_fileobj(
            file.file,
            BUCKET_NAME,
            unique_filename,
            ExtraArgs={"ContentType": file.content_type}
        )

        image_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{unique_filename}"

        await db.userprofile.update(
            where={"userId": id},
            data={"profile_picture": image_url}
            )
        
        return {"image_url": image_url}
        
    except NoCredentialsError:
        print('No Credentials Error')
        raise NoCredentialsError
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))