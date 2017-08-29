<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Services;
use Firebase\JWT\JWT;

/**
 * Description of JwtAuth
 *
 * @author Oscar Galvan
 */
class JwtAuth {
    
    public $manager;
    public $key;
    
    public function __construct($manager) {
        $this->manager = $manager;
        $this->key = "clave_secreta";
    }
    
    public function signUp($email, $password, $getHash = null) {
        $key = $this->key;
        
        $user = $this->manager->getRepository("BackendBundle:User")->findOneBy(
                array(
                    "email" => $email,
                    "password" => $password
                )
        );
        
        $signUp = false;
        if(is_object($user)) {
            $signUp = true;
        }
        
        if($signUp){
            $token = array(
              "sub" => $user->getId(),
              "email" => $user->getEmail(),
              "name" => $user->getName(),
              "surname" => $user->getSurName(),
              "password" => $user->getPassword(),
              "image" => $user->getImage(),
              "iat" => time(),
              "exp" => time() + (7 * 24 * 60 * 60)
            );
            
            $jwt = JWT::encode($token, $key, "HS256");
            $decoded = JWT::decode($jwt, $key, array("HS256"));
            
            if($getHash != null) {
                return $jwt;
            } else {
                return $decoded;
            }
        } else {
            return array("status" => "error", "data" => "Login failed.");
        }
    }
    
    public function checkToken($jwt, $getIdentity = false) {
        $key = $this->key;
        $auth = false;
        
        try {
            $decoded = JWT::decode($jwt, $key, array("HS256"));
        } catch (\UnexpectedValueException $e) {
            $auth = false;
        } catch (\DomainException $e) {
            $auth = false;
        }
        
        if(isset($decoded->sub)) {
            $auth = true;
        } else {
            $auth = false;
        }
        
        if($getIdentity) {
            return $decoded;
        } else {
            return $auth;
        }
        
        
    }
}
