<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\JsonResponse;
use BackendBundle\Entity\Video;
use BackendBundle\Entity\User;

/**
 * Description of VideoController
 *
 * @author Norma
 */
class VideoController extends Controller {

    public function newAction(Request $request) {
        $helpers = $this->get("app.helpers");

        $hash = $request->get("authorization", null);
        $authCheck = $helpers->authCheck($hash);

        if ($authCheck) {
            $identity = $helpers->authCheck($hash, true);
            $json = $request->get("json", null);

            if ($json != null) {
                $params = json_decode($json);

                $createdAt = new \DateTime("now");
                $updatedAt = new \DateTime("now");
                $image = null;
                $video_path = null;

                $userId = $identity->sub != null ? $identity->sub : null;
                $title = (isset($params->title)) ? $params->title : null;
                $description = (isset($params->description)) ? $params->description : null;
                $status = (isset($params->status)) ? $params->status : null;

                if ($userId != null && $title != null) {
                    $em = $this->getDoctrine()->getManager();
                    $user = $em->getRepository("BackendBundle:User")->findOneBy(array(
                        "id" => $userId
                    ));

                    $video = new Video();
                    $video->setUser($user);
                    $video->setTitle($title);
                    $video->setDescription($description);
                    $video->setStatus($status);
                    $video->setCreatedAt($createdAt);
                    $video->setUpdatedAt($updatedAt);

                    $em->persist($video);
                    $em->flush();

                    $video = $em->getRepository("BackendBundle:Video")->findOneBy(array(
                        "user" => $user,
                        "title" => $title,
                        "status" => $status,
                        "createdAt" => $createdAt
                    ));

                    $data = array(
                        "status" => "success",
                        "code" => 200,
                        "data" => $video
                    );
                } else {
                    $data = array(
                        "status" => "error",
                        "code" => 400,
                        "msg" => "Video not created."
                    );
                }
            } else {
                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "msg" => "Video not created. Params not valid"
                );
            }
        } else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "msg" => "Authorization not valid."
            );
        }

        return $helpers->json($data);
    }

    public function editAction(Request $request, $id = null) {
        $helpers = $this->get("app.helpers");


        $hash = $request->get("authorization", null);
        $authCheck = $helpers->authCheck($hash);

        if ($authCheck) {
            $identity = $helpers->authCheck($hash, true);
            $json = $request->get("json", null);

            if ($json != null) {
                $params = json_decode($json);

                $createdAt = new \DateTime("now");
                $updatedAt = new \DateTime("now");
                $image = null;
                $video_path = null;
                $video_id = $id;

                $userId = $identity->sub != null ? $identity->sub : null;
                $title = (isset($params->title)) ? $params->title : null;
                $description = (isset($params->description)) ? $params->description : null;
                $status = (isset($params->status)) ? $params->status : null;

                if ($userId != null && $title != null) {
                    $em = $this->getDoctrine()->getManager();


                    $video = $em->getRepository("BackendBundle:Video")->findOneBy(array(
                        "id" => $video_id
                    ));


                    if (isset($identity->sub) && $identity->sub == $video->getUser()->getId()) {
                        $video->setTitle($title);
                        $video->setDescription($description);
                        $video->setStatus($status);
                        $video->setUpdatedAt($updatedAt);

                        $em->persist($video);
                        $em->flush();

                        $data = array(
                            "status" => "success",
                            "code" => 200,
                            "msg" => "Video updated succesfully"
                        );
                    } else {
                        $data = array(
                            "status" => "error",
                            "code" => 400,
                            "msg" => "Video update error. Perhaps you are not the owner?"
                        );
                    }
                } else {
                    $data = array(
                        "status" => "error",
                        "code" => 400,
                        "msg" => "Video not created."
                    );
                }
            } else {
                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "msg" => "Video not created. Params not valid"
                );
            }
        } else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "msg" => "Authorization not valid."
            );
        }

        return $helpers->json($data);
    }

    public function uploadAction($id, Request $request) {
        $helpers = $this->get("app.helpers");

        $hash = $request->get("authorization", null);
        $authCheck = $helpers->authCheck($hash);


        if ($authCheck) {
            $identity = $helpers->authCheck($hash, true);
            $video_id = $id;

            $em = $this->getDoctrine()->getManager();
            $video = $em->getRepository("BackendBundle:Video")->findOneBy(array(
                "id" => $video_id
            ));

            if ($video_id != null && isset($identity->sub) && $identity->sub == $video->getUser()->getId()) {

                $file = $request->files->get("image", null);
                $file_video = $request->files->get("video", null);

                if ($file != null && !empty($file)) {
                    $ext = $file->guessExtension();

                    if ($ext == "jpeg" || $ext == "jpg" || $ext == "png") {
                        $file_name = time() . "." . $ext;
                        $path_of_file = "uploads/video_images/video_" . $video_id;
                        $file->move($path_of_file, $file_name);

                        $video->setImage($file_name);

                        $em->persist($video);
                        $em->flush();

                        $data = array(
                            "status" => "success",
                            "code" => 200,
                            "msg" => "Image file for video uploaded."
                        );
                    } else {
                        $data = array(
                            "status" => "error",
                            "code" => 400,
                            "msg" => "Image file for video not uploaded. Format not recognized"
                        );
                    }
                } else {
                    if ($file_video != null && !empty($file_video)) {
                        $ext = $file_video->guessExtension();

                        if ($ext == "mp4" || $ext == "avi") {
                            $file_name = time() . "." . $ext;
                            $path_of_file = "uploads/video_files/video_" . $video_id;
                            $file_video->move($path_of_file, $file_name);

                            $video->setVideoPath($file_name);

                            $em->persist($video);
                            $em->flush();

                            $data = array(
                                "status" => "success",
                                "code" => 200,
                                "msg" => "Video file uploaded."
                            );
                        } else {
                            $data = array(
                                "status" => "error",
                                "code" => 400,
                                "msg" => "Video file not uploaded. Format not recognized"
                            );
                        }
                    }
                }
            } else {
                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "msg" => "Video upload error. Perhaps you are not the owner?"
                );
            }
        } else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "msg" => "Authorization not valid."
            );
        }

        return $helpers->json($data);
    }

    public function videosAction(Request $request) {
        $helpers = $this->get("app.helpers");

        $em = $this->getDoctrine()->getManager();

        $dql = "SELECT v FROM BackendBundle:Video v ORDER BY v.id DESC";
        $query = $em->createQuery($dql);

        $page = $request->query->getInt("page", 1);
        $paginator = $this->get("knp_paginator");
        $items_per_page = 6;

        $pagination = $paginator->paginate($query, $page, $items_per_page);
        $total_items_count = $pagination->getTotalItemCount();

        $data = array(
            "status" => "success",
            "total_items_count" => $total_items_count,
            "page_actual" => $page,
            "items_per_page" => $items_per_page,
            "total_pages" => ceil($total_items_count / $items_per_page),
            "data" => $pagination
        );

        return $helpers->json($data);
    }

    public function latestVideosAction(Request $request) {
        $helpers = $this->get("app.helpers");
        $em = $this->getDoctrine()->getManager();

        $dql = "SELECT v FROM BackendBundle:Video v ORDER BY v.createdAt DESC";
        $query = $em->createQuery($dql)->setMaxResults(5);
        $videos = $query->getResult();

        $data = array(
            "status" => "success",
            "data" => $videos
        );

        return $helpers->json($data);
    }

    public function videoAction(Request $request, $id = null) {
        $helpers = $this->get("app.helpers");
        $em = $this->getDoctrine()->getManager();

        $video = $em->getRepository("BackendBundle:Video")->findOneBy(array(
            "id" => $id
        ));

        if ($video) {
            $data = array();
            $data["status"] = "success";
            $data["code"] = 200;
            $data["data"] = $video;
        } else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "msg" => "Could not find video with given ID"
            );
        }


        return $helpers->json($data);
    }

    public function searchAction(Request $request, $search = null) {
        $helpers = $this->get("app.helpers");
        $em = $this->getDoctrine()->getManager();

        if ($search != null) {
            $dql = "SELECT v FROM BackendBundle:Video v WHERE v.title LIKE :search OR "
                    . "v.description LIKE :search ORDER BY v.createdAt DESC";
            $query = $em->createQuery($dql)->setParameter("search", "%$search%");
        } else {
            $dql = "SELECT v FROM BackendBundle:Video v ORDER BY v.createdAt DESC";
            $query = $em->createQuery($dql);
        }

        

        $page = $request->query->getInt("page", 1);
        $paginator = $this->get("knp_paginator");
        $items_per_page = 6;

        $pagination = $paginator->paginate($query, $page, $items_per_page);
        $total_items_count = $pagination->getTotalItemCount();

        $data = array(
            "status" => "success",
            "total_items_count" => $total_items_count,
            "page_actual" => $page,
            "items_per_page" => $items_per_page,
            "total_pages" => ceil($total_items_count / $items_per_page),
            "data" => $pagination
        );

        return $helpers->json($data);
    }

}
