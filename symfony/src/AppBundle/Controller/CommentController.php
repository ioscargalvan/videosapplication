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
use BackendBundle\Entity\User;

/**
 * Description of CommentController
 *
 * @author Norma
 */
class CommentController extends Controller {

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
                $user_id = (isset($identity->sub)) ? $identity->sub : null;
                $video_id = (isset($params->video_id)) ? $params->video_id : null;
                $body = (isset($params->body)) ? $params->body : null;

                if ($user_id != null && $video_id != null) {
                    $em = $this->getDoctrine()->getManager();

                    $user = $em->getRepository("BackendBundle:User")->findOneBy(array(
                        "id" => $user_id
                    ));

                    $video = $em->getRepository("BackendBundle:Video")->findOneBy(array(
                        "id" => $video_id
                    ));

                    $comment = new \BackendBundle\Entity\Comment();

                    $comment->setUser($user);
                    $comment->setVideo($video);
                    $comment->setBody($body);
                    $comment->setCreatedAt($createdAt);

                    $em->persist($comment);
                    $em->flush();

                    $data = array(
                        "status" => "success",
                        "code" => 200,
                        "msg" => "Comment created successfully"
                    );
                } else {
                    $data = array(
                        "status" => "error",
                        "code" => 400,
                        "msg" => "Comment not created, params not valid."
                    );
                }
            } else {
                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "msg" => "Params not valid"
                );
            }
        } else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "msg" => "Authentication not valid"
            );
        }

        return $helpers->json($data);
    }

    public function deleteAction(Request $request, $id = null) {
        $helpers = $this->get("app.helpers");

        $hash = $request->get("authorization", null);

        $authCheck = $helpers->authCheck($hash);

        if ($authCheck) {
            $identity = $helpers->authCheck($hash, true);

            $user_id = ($identity->sub != null) ? $identity->sub : null;

            $em = $this->getDoctrine()->getManager();
            $comment = $em->getRepository("BackendBundle:Comment")->findOneBy(array(
                "id" => $id
            ));

            if (is_object($comment) && $user_id != null) {
                if (isset($identity->sub) && $comment->getUser()->getId() == $user_id ||
                        $comment->getVideo()->getUser()->getId() == $user_id) {

                    $em->remove($comment);
                    $em->flush();

                    $data = array(
                        "status" => "success",
                        "code" => 200,
                        "msg" => "Comment deleted successfully"
                    );
                }
            } else {
                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "msg" => "Comment not found"
                );
            }
        } else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "msg" => "Authentication not valid"
            );
        }

        return $helpers->json($data);
    }
    
    public function listAction(Request $request, $id = null) {
        $helpers = $this->get("app.helpers");
        $em = $this->getDoctrine()->getManager();
        
        $video = $em->getRepository("BackendBundle:Video")->findOneBy(array(
            "id" => $id
        ));
        
        $comments = $em->getRepository("BackendBundle:Comment")->findBy(array(
            "video" => $video
        ), array(
            "id" => "DESC"
        ));
        
        if(count($comments) >= 1) {
            $data = array(
                "status" => "success",
                "code" => 200,
                "data" => $comments
            );
        } else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "msg" => "This video has no comments."
            );
        }
        
        return $helpers->json($data);
    }

}
