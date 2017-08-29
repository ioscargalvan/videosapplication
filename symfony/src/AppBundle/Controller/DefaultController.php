<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends Controller
{
    
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..'),
        ]);
    }
    
    public function pruebasAction(Request $request)
    {
        
        $helpers = $this->get("app.helpers");
        
        $hash = $request->get("authorization", null);
        $check = $helpers->authCheck($hash);
        
        var_dump($check);
        die();
        
//        $em = $this->getDoctrine()->getManager();
//        $users = $em->getRepository("BackendBundle:User")->findAll();

        return $helpers->json($users);
    }
    
    public function loginAction(Request $request) {
        $helpers = $this->get("app.helpers");
        $jwt_auth = $this->get("app.jwt_auth");
        
        // Recibir JSON por POST
        $json = $request->get("json", null);
    
        if($json != null) {
            $params = json_decode($json);

            
            $email = (isset($params->email)) ? $params->email : null;
            $password = (isset($params->password)) ? $params->password : null;
            $getHash = (isset($params->gethash)) ? $params->gethash : null;
            
            $emailConstraint = new Assert\Email();
            $emailConstraint->message = "This email is not valid!";
            
            $validator = $this->get("validator")->validate($email, $emailConstraint);
            // Cifrar password
            $pwd = hash('sha256', $password);
            
            if(count($validator) == 0 && $password != null) {
                
                if($getHash == null) {
                   $signUp = $jwt_auth->signUp($email, $pwd); 
                } else {
                    $signUp = $jwt_auth->signUp($email, $pwd, "hash");
                }
                return new JsonResponse($signUp);
            } else {
                return $helpers->json(array(
                    "status" => "error",
                    "data" => "Login not valid."));
            }
        } else {
            return $helpers->json(array(
                    "status" => "error",
                    "data" => "Send JSON with POST."));
        }
        
        
    }
    
    
}
