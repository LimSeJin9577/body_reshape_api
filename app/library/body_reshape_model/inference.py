# test.py's fastapi server version
# without toml file

# coding=utf-8
# summary:
# author: Jianqiang Ren
# date:

from reshape_base_algos.body_retoucher import BodyRetoucher
import time
import cv2
import argparse
import numpy as np
import glob
import tqdm
import os
import json
import shutil


def recurve_search(root_path, all_paths, suffix=[]):
    for file in os.listdir(root_path):
        target_file = os.path.join(root_path, file)
        if os.path.isfile(target_file):
            (path, extension) = os.path.splitext(target_file)
            
            if extension in suffix:
                all_paths.append(target_file)
        else:
            recurve_search(target_file, all_paths, suffix)


if __name__ == "__main__":
    '''
    inference.sh >> 
        1) model initiate
        2) inference    
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', type=str, required=True, help="image or files")
    parser.add_argument('--degree',default=0.0, type=float)
    args = parser.parse_args()

    # degree init
    degree_list = []
    if args.mode == "image" :
        degree_list = list(range(0,11))
        degree_list = list(map(lambda x : x/10, degree_list))
    elif args.mode == "files" :
        degree_list = [args.degree]
    else : 
        print("올바르지 않은 degree 값입니다.")
        exit(0)

    # Initiate without testconfig
    reshape_ckpt_path = "/home/sejin/gitfile/body_reshape_api/app/library/body_reshape/models/body_reshape_model.pth" # static, Reshape Model
    pose_estimation_ckpt = "/home/sejin/gitfile/body_reshape_api/app/library/body_reshape/models/body_pose_model.pth" # static, Pose Model
    save_dir = "/home/sejin/gitfile/body_reshape_api/static/resources/temp_save" # static, output_path
    src_dir = "/home/sejin/gitfile/body_reshape_api/static/resources/temp_src" # static, input_path

    
    # timestamp = time.strftime("%Y%m%d-%H%M%S", time.localtime())
    

    print("loading model:{}".format(reshape_ckpt_path))

    ret = BodyRetoucher.init(reshape_ckpt_path=reshape_ckpt_path,
                             pose_estimation_ckpt=pose_estimation_ckpt,
                             device=0, log_level='error',
                             log_path='test_log.txt',
                             debug_level=0)
    if ret == 0:
        print('init done')
    else:
        print('init error:{}'.format(ret))
        exit(0)

    # make save_directory
    if os.path.exists(save_dir):
        shutil.rmtree(save_dir)
    os.makedirs(save_dir, exist_ok=True)

    # image file exception
    if os.path.isfile(src_dir):
        img_list = [src_dir]
    elif os.path.exists(os.path.join(src_dir, "src")):
        img_list = glob.glob("{}/*.*g".format(os.path.join(src_dir, "src")))
    else:
        img_list = []
        recurve_search(src_dir, img_list, suffix=['.png', '.jpg', '.jpeg','.JPG'])

    # initiate variable
    img_list = sorted(img_list)

    lpips_list = []
    ssim_list = []
    psnr_list = []
    epe_list = []

    src_lpips_list = []
    src_ssim_list = []
    src_psnr_list = []

    bad_sample = []

    # Inference Images
    pbar = tqdm.tqdm(img_list)
    for src_path in pbar:
        basename = os.path.basename(src_path)
        base = os.path.splitext(basename)[0]

        src_img = cv2.imread(src_path)
        if src_img is None:
            print('Error: src_img is None')
            continue

        for degree in degree_list :
            # ***Main Predition***
            pred, flow = BodyRetoucher.reshape_body(src_img, degree=degree)

            if flow is None:
                bad_sample.append(src_path)
                continue

            cv2.imwrite(os.path.join(save_dir,base + "_warp_{}.jpg".format(str(degree).replace(".",""))),pred) #results
            # cv2.imwrite(os.path.join(save_dir, base + ".jpg"), src_img) #source

    BodyRetoucher.release()
    print('all done')

